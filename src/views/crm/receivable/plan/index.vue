<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="客户" prop="customerId">
        <el-input v-model="queryParams.customerId" class="!w-240px" clearable placeholder="请输入客户" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="合同" prop="contractId">
        <el-input v-model="queryParams.contractId" class="!w-240px" clearable placeholder="请输入合同" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button v-hasPermi="['crm:receivable-plan:create']" plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['crm:receivable-plan:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <!--<el-table-column label="ID" align="center" prop="id" />-->
      <el-table-column align="center" label="客户名称" prop="customerId" width="150px" />
      <el-table-column align="center" label="合同名称" prop="contractId" width="150px" />
      <el-table-column align="center" label="期数" prop="period" />
      <el-table-column align="center" label="计划回款" prop="price" />
      <el-table-column align="center" :formatter="dateFormatter2" label="计划回款日期" prop="returnTime" width="180px" />
      <el-table-column align="center" label="提前几天提醒" prop="remindDays" />
      <!--<el-table-column
        label="提醒日期"
        align="center"
        prop="remindTime"
        :formatter="dateFormatter"
        width="180px"
      />-->
      <!--<el-table-column label="回款ID" align="center" prop="receivableId" />-->
      <el-table-column align="center" label="完成状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="审批状态" prop="checkStatus" width="130px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CRM_AUDIT_STATUS" :value="scope.row.checkStatus" />
        </template>
      </el-table-column>
      <!--<el-table-column label="工作流编号" align="center" prop="processInstanceId" />-->
      <el-table-column label="负责人" prop="ownerUserId" width="120">
        <template #default="scope">
          {{ userList.find((user) => user.id === scope.row.ownerUserId)?.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="显示顺序" prop="sort" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180px" />
      <el-table-column align="center" label="操作" width="130px">
        <template #default="scope">
          <el-button v-hasPermi="['crm:receivable-plan:update']" link type="primary" @click="openForm('update', scope.row.id)">
            编辑
          </el-button>
          <el-button v-hasPermi="['crm:receivable-plan:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ReceivablePlanForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import ReceivablePlanForm from './ReceivablePlanForm.vue'
import * as ReceivablePlanApi from '/@/api/crm/receivable/plan'
import * as UserApi from '/@/api/system/user'
import { DICT_TYPE } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter, dateFormatter2 } from '/@/utils/formatTime'

defineOptions({ name: 'ReceivablePlan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const userList = ref<UserApi.UserVO[]>([]) // 用户列表
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: null,
  contractId: null,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ReceivablePlanApi.getReceivablePlanPage(queryParams)
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
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ReceivablePlanApi.deleteReceivablePlan(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch (e) {
    console.log(e)
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ReceivablePlanApi.exportReceivablePlan(queryParams)
    download.excel(data, '回款计划.xls')
  } catch (e) {
    console.log(e)
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 获取用户列表
  userList.value = await UserApi.getSimpleUserList()
})
</script>
