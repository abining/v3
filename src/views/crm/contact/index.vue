<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="客户" prop="customerId">
        <el-select
          v-model="queryParams.customerId"
          clearable
          lable-key="name"
          placeholder="请选择客户"
          value-key="id"
          @keyup.enter="handleQuery"
        >
          <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入姓名" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="queryParams.mobile" class="!w-240px" clearable placeholder="请输入手机号" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="座机" prop="telephone">
        <el-input v-model="queryParams.telephone" class="!w-240px" clearable placeholder="请输入电话" @keyup.enter="handleQuery" />
      </el-form-item>

      <el-form-item label="QQ" prop="qq">
        <el-input v-model="queryParams.qq" class="!w-240px" clearable placeholder="请输入QQ" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="微信" prop="wechat">
        <el-input v-model="queryParams.wechat" class="!w-240px" clearable placeholder="请输入微信" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="queryParams.email" class="!w-240px" clearable placeholder="请输入电子邮箱" @keyup.enter="handleQuery" />
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
        <el-button v-hasPermi="['crm:contact:create']" type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['crm:contact:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" fixed="left" label="姓名" prop="name">
        <template #default="scope">
          <el-link type="primary" :underline="false" @click="openDetail(scope.row.id)">
            {{ scope.row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="left" label="客户" prop="customerName" />
      <el-table-column align="center" label="性别" prop="sex">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="scope.row.sex" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位" prop="post" />
      <el-table-column align="center" label="是否关键决策人" prop="master">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.master" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="直属上级" prop="parentName" />
      <el-table-column align="center" label="手机号" prop="mobile" />
      <el-table-column align="center" label="座机" prop="telephone" />
      <el-table-column align="center" label="QQ" prop="qq" />
      <el-table-column align="center" label="微信" prop="wechat" />
      <el-table-column align="center" label="邮箱" prop="email" />
      <el-table-column align="center" label="地址" prop="address" />
      <el-table-column align="center" :formatter="dateFormatter" label="下次联系时间" prop="nextTime" width="180px" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" :formatter="dateFormatter" label="最后跟进时间" prop="lastTime" width="180px" />
      <el-table-column align="center" label="负责人" prop="ownerUserId">
        <template #default="scope">
          {{ scope.row.ownerUserName }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="所属部门" align="center" prop="ownerUserId" /> -->
      <el-table-column align="center" :formatter="dateFormatter" label="更新时间" prop="updateTime" width="180px" />
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180px" />
      <!-- <el-table-column
        label="创建人"
        align="center"
        prop="creator"
        :formatter="dateFormatter"
        width="180px"
      >
        <template #default="scope">
          {{ userList.find((user) => user.id === scope.row.creator)?.nickname }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button v-hasPermi="['crm:contact:update']" plain type="primary" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button v-hasPermi="['crm:contact:delete']" plain type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ContactForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import ContactForm from './ContactForm.vue'
import * as ContactApi from '/@/api/crm/contact'
import * as CustomerApi from '/@/api/crm/customer'
import { DICT_TYPE } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'CrmContact' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const customerList = ref<CustomerApi.CustomerVO[]>([]) // 客户列表
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nextTime: [],
  mobile: null,
  telephone: null,
  email: null,
  customerId: null,
  address: null,
  remark: null,
  ownerUserId: null,
  createTime: [],
  lastTime: [],
  parentId: null,
  name: null,
  post: null,
  qq: null,
  wechat: null,
  sex: null,
  policyMakers: null,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContactApi.getContactPage(queryParams)
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
    await ContactApi.deleteContact(id)
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
    const data = await ContactApi.exportContact(queryParams)
    download.excel(data, '联系人.xls')
  } catch (e) {
    console.log(e)
  } finally {
    exportLoading.value = false
  }
}

/** 打开客户详情 */
const { push } = useRouter()
const openDetail = (id: number) => {
  push({ name: 'CrmContactDetail', params: { id } })
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  customerList.value = await CustomerApi.queryAllList()
})
</script>
