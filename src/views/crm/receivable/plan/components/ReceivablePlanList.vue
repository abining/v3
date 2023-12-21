<template>
  <!-- 操作栏 -->
  <el-row justify="end">
    <el-button @click="openForm">
      <Icon class="mr-5px" icon="icon-park:income" />
      创建回款计划
    </el-button>
  </el-row>

  <!-- 列表 -->
  <ContentWrap class="mt-10px">
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" fixed="left" label="期数" prop="no">
        <template #default="scope">
          <el-link type="primary" :underline="false" @click="openDetail(scope.row.id)">
            {{ scope.row.period }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户名称" prop="customerName" />
      <el-table-column align="center" label="合同编号" prop="contractNo" />
      <el-table-column align="center" :formatter="fenToYuanFormat" label="计划还款金额（元）" prop="price" />
      <el-table-column align="center" :formatter="dateFormatter" label="计划还款日期" prop="returnTime" width="180px" />
      <el-table-column align="center" label="计划还款方式" prop="auditStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CRM_RECEIVABLE_RETURN_TYPE" :value="scope.row.returnType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="提前几日提醒" prop="remindDays" />
      <el-table-column align="center" label="备注" prop="remark" />
      <!-- TODO 芋艿：新建回款、编辑、删除 -->
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加 -->
  <ReceivableForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import * as ReceivablePlanApi from '/@/api/crm/receivable/plan'
import ReceivableForm from './../ReceivablePlanForm.vue'
import { BizTypeEnum } from '/@/api/crm/permission'
import { dateFormatter } from '/@/utils/formatTime'
import { fenToYuanFormat } from '/@/utils/formatter'
import { DICT_TYPE } from '/@/utils/dict'

defineOptions({ name: 'CrmReceivablePlanList' })
const props = defineProps<{
  bizType: number // 业务类型
  bizId: number // 业务编号
}>()

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  customerId: undefined as unknown, // 允许 undefined + number
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // 置空参数
    queryParams.customerId = undefined
    // 执行查询
    let data = { list: [], total: 0 }
    switch (props.bizType) {
      case BizTypeEnum.CRM_CUSTOMER:
        queryParams.customerId = props.bizId
        data = await ReceivablePlanApi.getReceivablePlanPageByCustomer(queryParams)
        break
      default:
        return
    }
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

/** 添加 */
const formRef = ref()
const openForm = () => {
  formRef.value.open('create')
}

/** 打开合同详情 */
const { push } = useRouter()
const openDetail = (id: number) => {
  push({ name: 'CrmReceivablePlanDetail', params: { id } })
}

/** 监听打开的 bizId + bizType，从而加载最新的列表 */
watch(
  () => [props.bizId, props.bizType],
  () => {
    handleQuery()
  },
  { immediate: true, deep: true }
)
</script>
