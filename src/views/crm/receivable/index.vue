<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="回款编号" prop="no">
        <el-input v-model="queryParams.no" class="!w-240px" clearable placeholder="请输入回款编号" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerId">
        <el-input v-model="queryParams.customerId" class="!w-240px" clearable placeholder="请输入客户名称" @keyup.enter="handleQuery" />
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
        <el-button v-hasPermi="['crm:receivable:create']" plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['crm:receivable:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column align="center" label="回款编号" prop="no" />
      <!-- <el-table-column label="回款计划ID" align="center" prop="planId" />-->
      <el-table-column align="center" label="客户" prop="customerId" />
      <el-table-column align="center" label="合同" prop="contractId" />
      <el-table-column align="center" label="审批状态" prop="checkStatus" width="130px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CRM_AUDIT_STATUS" :value="scope.row.checkStatus" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="工作流编号" align="center" prop="processInstanceId" />-->
      <el-table-column align="center" :formatter="dateFormatter2" label="回款日期" prop="returnTime" width="150px" />
      <el-table-column align="center" label="回款方式" prop="returnType" width="130px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CRM_RECEIVABLE_RETURN_TYPE" :value="scope.row.returnType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="回款金额(元)" prop="price" />
      <el-table-column align="center" label="负责人" prop="ownerUserId" />
      <el-table-column align="center" label="批次" prop="batchId" />
      <!--<el-table-column label="显示顺序" align="center" prop="sort" />-->
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180px" />
      <el-table-column align="center" label="操作" width="180px">
        <template #default="scope">
          <!-- todo @liuhongfeng：用路径参数哈，receivableId -->
          <!--<router-link :to="'/crm/receivable-plan?receivableId=' + scope.row.receivableId">
            <el-button link type="primary">详情</el-button>
          </router-link>-->
          <el-button v-hasPermi="['crm:receivable:update']" link type="primary" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button v-hasPermi="['crm:receivable:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ReceivableForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import ReceivableForm from './ReceivableForm.vue'
import * as ReceivableApi from '/@/api/crm/receivable'
import { DICT_TYPE } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter, dateFormatter2 } from '/@/utils/formatTime'

defineOptions({ name: 'Receivable' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: null,
  customerId: null,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ReceivableApi.getReceivablePage(queryParams)
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
    await ReceivableApi.deleteReceivable(id)
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
    const data = await ReceivableApi.exportReceivable(queryParams)
    download.excel(data, '回款.xls')
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
