<template>
  <doc-alert title="用户体系" url="https://doc.iocoder.cn/user-center/" />
  <doc-alert title="三方登陆" url="https://doc.iocoder.cn/social-user/" />
  <doc-alert title="Excel 导入导出" url="https://doc.iocoder.cn/excel-import-and-export/" />

  <el-row :gutter="20">
    <!-- 左侧部门树 -->
    <el-col :span="4" :xs="24">
      <content-wrap class="h-1/1">
        <dept-tree @node-click="handleDeptNodeClick" />
      </content-wrap>
    </el-col>
    <el-col :span="20" :xs="24">
      <!-- 搜索 -->
      <content-wrap>
        <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="queryParams.username" class="!w-240px" clearable placeholder="请输入用户名称" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="queryParams.mobile" class="!w-240px" clearable placeholder="请输入手机号码" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="用户状态">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="queryParams.createTime"
              class="!w-240px"
              end-placeholder="结束日期"
              start-placeholder="开始日期"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery">
              <icon icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery">
              <icon icon="ep:refresh" />
              重置
            </el-button>
            <el-button v-hasPermi="['system:user:create']" plain type="primary" @click="openForm('create')">
              <icon icon="ep:plus" />
              新增
            </el-button>
            <el-button v-hasPermi="['system:user:import']" plain type="warning" @click="handleImport">
              <icon icon="ep:upload" />
              导入
            </el-button>
            <el-button v-hasPermi="['system:user:export']" :loading="exportLoading" plain type="success" @click="handleExport">
              <icon icon="ep:download" />
              导出
            </el-button>
          </el-form-item>
        </el-form>
      </content-wrap>
      <content-wrap>
        <el-table v-loading="loading" :data="list">
          <el-table-column key="id" align="center" label="用户编号" prop="id" />
          <el-table-column align="center" label="用户名称" prop="username" :show-overflow-tooltip="true" />
          <el-table-column align="center" label="用户昵称" prop="nickname" :show-overflow-tooltip="true" />
          <el-table-column key="deptName" align="center" label="部门" prop="deptName" :show-overflow-tooltip="true" />
          <el-table-column align="center" label="手机号码" prop="mobile" width="120" />
          <el-table-column key="status" label="状态">
            <template #default="scope">
              <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" @change="handleStatusChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180" />
          <el-table-column align="center" label="操作" width="160">
            <template #default="scope">
              <div class="flex items-center justify-center">
                <el-button v-hasPermi="['system:user:update']" link type="primary" @click="openForm('update', scope.row.id)">
                  <icon icon="ep:edit" />
                  修改
                </el-button>
                <el-dropdown
                  v-hasPermi="['system:user:delete', 'system:user:update-password', 'system:permission:assign-user-role']"
                  @command="(command) => handleCommand(command, scope.row)"
                >
                  <el-button link type="primary">
                    <icon icon="ep:d-arrow-right" />
                    更多
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-if="checkPermi(['system:user:delete'])" command="handleDelete">
                        <icon icon="ep:delete" />
                        删除
                      </el-dropdown-item>
                      <el-dropdown-item v-if="checkPermi(['system:user:update-password'])" command="handleResetPwd">
                        <icon icon="ep:key" />
                        重置密码
                      </el-dropdown-item>
                      <el-dropdown-item v-if="checkPermi(['system:permission:assign-user-role'])" command="handleRole">
                        <icon icon="ep:circle-check" />
                        分配角色
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
      </content-wrap>
    </el-col>
  </el-row>

  <!-- 添加或修改用户对话框 -->
  <user-form ref="formRef" @success="getList" />
  <!-- 用户导入对话框 -->
  <user-import-form ref="importFormRef" @success="getList" />
  <!-- 分配角色 -->
  <user-assign-role-form ref="assignRoleFormRef" @success="getList" />
</template>
<script lang="ts" setup>
import DeptTree from './DeptTree.vue'
import UserAssignRoleForm from './UserAssignRoleForm.vue'
import UserForm from './UserForm.vue'
import UserImportForm from './UserImportForm.vue'
import * as UserApi from '/@/api/system/user'
import { CommonStatusEnum } from '/@/utils/constants'
import { DICT_TYPE, getIntDictOptions } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'
import { checkPermi } from '/@/utils/permission'

defineOptions({ name: 'SystemUser' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: undefined,
  mobile: undefined,
  status: undefined,
  deptId: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getUserPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 处理部门被点击 */
const handleDeptNodeClick = async (row) => {
  queryParams.deptId = row.id
  await getList()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 用户导入 */
const importFormRef = ref()
const handleImport = () => {
  importFormRef.value.open()
}

/** 修改用户状态 */
const handleStatusChange = async (row: UserApi.UserVO) => {
  try {
    // 修改状态的二次确认
    const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
    await message.confirm(`确认要"${text}""${row.username}"用户吗?`)
    // 发起修改状态
    await UserApi.updateUserStatus(row.id, row.status)
    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.status = row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

/** 导出按钮操作 */
const exportLoading = ref(false)
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await UserApi.exportUser(queryParams)
    download.excel(data, '用户数据.xls')
  } catch (e) {
    console.log(e)
  } finally {
    exportLoading.value = false
  }
}

/** 操作分发 */
const handleCommand = (command: string, row: UserApi.UserVO) => {
  switch (command) {
    case 'handleDelete':
      handleDelete(row.id)
      break
    case 'handleResetPwd':
      handleResetPwd(row)
      break
    case 'handleRole':
      handleRole(row)
      break
    default:
      break
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await UserApi.deleteUser(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch (e) {
    console.log(e)
  }
}

/** 重置密码 */
const handleResetPwd = async (row: UserApi.UserVO) => {
  try {
    // 重置的二次确认
    const result = await message.prompt(`请输入"${row.username}"的新密码`, t('common.reminder'))
    const password = result.value
    // 发起重置
    await UserApi.resetUserPwd(row.id, password)
    message.success(`修改成功，新密码是：${password}`)
  } catch (e) {
    console.log(e)
  }
}

/** 分配角色 */
const assignRoleFormRef = ref()
const handleRole = (row: UserApi.UserVO) => {
  assignRoleFormRef.value.open(row)
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
