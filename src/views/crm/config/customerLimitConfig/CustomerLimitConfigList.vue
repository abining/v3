<template>
  <el-button plain type="primary" @click="handleQuery">
    <Icon class="mr-5px" icon="ep:refresh" />
    刷新
  </el-button>
  <el-button v-hasPermi="['crm:customer-limit-config:create']" plain type="primary" @click="openForm('create')">
    <Icon class="mr-5px" icon="ep:plus" />
    新增
  </el-button>
  <el-table v-loading="loading" class="mt-4" :data="list" :show-overflow-tooltip="true" :stripe="true">
    <el-table-column align="center" label="编号" prop="id" />
    <el-table-column align="center" label="规则类型" prop="type" />
    <el-table-column align="center" :formatter="(row) => row.users?.map((user: any) => user.nickname).join('，')" label="规则适用人群" />
    <el-table-column align="center" :formatter="(row) => row.depts?.map((dept: any) => dept.name).join('，')" label="规则适用部门" />
    <el-table-column
      align="center"
      :label="confType === LimitConfType.CUSTOMER_QUANTITY_LIMIT ? '拥有客户数上限' : '锁定客户数上限'"
      prop="maxCount"
    />
    <el-table-column
      v-if="confType === LimitConfType.CUSTOMER_QUANTITY_LIMIT"
      align="center"
      label="成交客户是否占用拥有客户数"
      prop="dealCountEnabled"
    >
      <template #default="scope">
        <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.dealCountEnabled" />
      </template>
    </el-table-column>
    <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180px" />
    <el-table-column align="center" fixed="right" label="操作" min-width="110">
      <template #default="scope">
        <el-button v-hasPermi="['crm:customer-limit-config:update']" link type="primary" @click="openForm('update', scope.row.id)">
          编辑
        </el-button>
        <el-button v-hasPermi="['crm:customer-limit-config:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />

  <!-- 表单弹窗：添加/修改 -->
  <CustomerLimitConfigForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import * as CustomerLimitConfigApi from '/@/api/crm/customerLimitConfig'
import { LimitConfType } from '/@/api/crm/customerLimitConfig'
import { DICT_TYPE } from '/@/utils/dict'
import { dateFormatter } from '/@/utils/formatTime'
import CustomerLimitConfigForm from '/@/views/crm/config/customerLimitConfig/CustomerLimitConfigForm.vue'

defineOptions({ name: 'CustomerLimitConfigList' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const { confType } = defineProps<{ confType: LimitConfType }>()

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: confType,
})
// const queryFormRef = ref() // 搜索的表单
// const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerLimitConfigApi.getCustomerLimitConfigPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id, confType)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CustomerLimitConfigApi.deleteCustomerLimitConfig(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch (e) {
    console.log(e)
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
