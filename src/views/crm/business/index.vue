<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="商机名称" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入商机名称" @keyup.enter="handleQuery" />
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
        <el-button v-hasPermi="['crm:business:create']" type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['crm:business:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="商机名称" prop="name" />
      <el-table-column align="center" label="客户名称" prop="customerName" />
      <el-table-column align="center" label="商机金额" prop="price" />
      <el-table-column align="center" :formatter="dateFormatter" label="预计成交日期" prop="dealTime" width="180px" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="商机状态类型" prop="statusTypeName" />
      <el-table-column align="center" label="商机状态" prop="statusName" />
      <el-table-column align="center" :formatter="dateFormatter" label="更新时间" prop="updateTime" width="180px" />
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180px" />
      <el-table-column align="center" label="负责人" prop="ownerUserId" />
      <el-table-column align="center" label="创建人" prop="creator" />
      <el-table-column align="center" label="跟进状态" prop="followUpStatus" />
      <el-table-column align="center" fixed="right" label="操作" width="130px">
        <template #default="scope">
          <el-button v-hasPermi="['crm:business:update']" link type="primary" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button v-hasPermi="['crm:business:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <BusinessForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import BusinessForm from './BusinessForm.vue'
import * as BusinessApi from '/@/api/crm/business/index'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'CrmBusiness' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: null,
  statusTypeId: null,
  statusId: null,
  contactNextTime: [],
  customerId: null,
  dealTime: [],
  price: null,
  discountPercent: null,
  productPrice: null,
  remark: null,
  ownerUserId: null,
  createTime: [],
  roUserIds: null,
  rwUserIds: null,
  endStatus: null,
  endRemark: null,
  contactLastTime: [],
  followUpStatus: null,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BusinessApi.getBusinessPage(queryParams)
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
    await BusinessApi.deleteBusiness(id)
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
    const data = await BusinessApi.exportBusiness(queryParams)
    download.excel(data, '商机.xls')
  } catch (e) {
    console.log(e)
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
