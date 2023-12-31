<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="合同编号" prop="no">
        <el-input v-model="queryParams.no" class="!w-240px" clearable placeholder="请输入合同编号" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="合同名称" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入合同名称" @keyup.enter="handleQuery" />
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
        <el-button v-hasPermi="['crm:contract:create']" type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['crm:contract:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <!-- TODO 芋艿：各种字段要调整 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="合同编号" prop="id" />
      <el-table-column align="center" label="合同名称" prop="name" />
      <el-table-column align="center" label="客户名称" prop="customerId" />
      <el-table-column align="center" label="商机名称" prop="businessId" />
      <el-table-column align="center" label="工作流名称" prop="processInstanceId" />
      <el-table-column align="center" :formatter="dateFormatter" label="下单时间" prop="orderDate" width="180px" />
      <el-table-column align="center" label="负责人" prop="ownerUserId" />
      <el-table-column align="center" label="合同编号" prop="no" />
      <el-table-column align="center" :formatter="dateFormatter" label="开始时间" prop="startTime" width="180px" />
      <el-table-column align="center" :formatter="dateFormatter" label="结束时间" prop="endTime" width="180px" />
      <el-table-column align="center" label="合同金额" prop="price" />
      <el-table-column align="center" label="整单折扣" prop="discountPercent" />
      <el-table-column align="center" label="产品总金额" prop="productPrice" />
      <el-table-column align="center" label="联系人" prop="contactId" />
      <el-table-column align="center" label="公司签约人" prop="signUserId" />
      <el-table-column align="center" :formatter="dateFormatter" label="最后跟进时间" prop="contactLastTime" width="180px" />
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180px" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column label="操作" width="120px">
        <template #default="scope">
          <el-button v-hasPermi="['crm:contract:update']" link type="primary" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button v-hasPermi="['crm:contract:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ContractForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import ContractForm from './ContractForm.vue'
import * as ContractApi from '/@/api/crm/contract'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'CrmContract' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: null,
  customerId: null,
  businessId: null,
  orderDate: [],
  no: null,
  discountPercent: null,
  productPrice: null,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContractApi.getContractPage(queryParams)
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
    await ContractApi.deleteContract(id)
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
    const data = await ContractApi.exportContract(queryParams)
    download.excel(data, '合同.xls')
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
