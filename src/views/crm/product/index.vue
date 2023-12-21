<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入产品名称" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择状态">
          <el-option
            v-for="dict in getBoolDictOptions(DICT_TYPE.CRM_PRODUCT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
        <el-button v-hasPermi="['crm:product:create']" type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['crm:product:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <!--<el-table-column label="主键id" align="center" prop="id" />-->
      <el-table-column align="center" label="产品名称" prop="name" />
      <el-table-column align="center" label="产品编码" prop="no" />
      <el-table-column align="center" label="单位" prop="unit">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PRODUCT_UNIT" :value="scope.row.unit" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格" prop="price">
        <template #default="{ row }">
          {{ fenToYuan(row.price) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CRM_PRODUCT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品分类" prop="categoryId">
        <template #default="{ row }">
          <span>{{ productCategoryList?.find((c) => c.id === row.categoryId)?.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品描述" prop="description" />
      <el-table-column align="center" label="负责人" prop="ownerUserId">
        <template #default="{ row }">
          <span>{{ userList?.find((c) => c.id === row.ownerUserId)?.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180px" />
      <el-table-column align="center" label="操作" width="160">
        <template #default="scope">
          <el-button v-hasPermi="['crm:product:query']" link type="primary" @click="openDetail(scope.row)">详情</el-button>
          <el-button v-hasPermi="['crm:product:update']" link type="primary" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button v-hasPermi="['crm:product:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProductForm ref="formRef" @success="getList" />

  <!-- 表单弹窗：详情 -->
  <ProductDetail ref="detailRef" @success="getList" />
</template>

<script setup lang="ts">
import ProductDetail from './ProductDetail.vue'
import ProductForm from './ProductForm.vue'
import * as ProductApi from '/@/api/crm/product'
import * as ProductCategoryApi from '/@/api/crm/product/productCategory'
import { UserVO, getSimpleUserList } from '/@/api/system/user'
import { fenToYuan } from '/@/utils'
import { DICT_TYPE, getBoolDictOptions } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'CrmProduct' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: null,
  no: null,
  unit: null,
  price: null,
  status: null,
  categoryId: null,
  description: null,
  ownerUserId: null,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductApi.getProductPage(queryParams)
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
/** 详情操作 */
const detailRef = ref()
const openDetail = (data: ProductApi.ProductVO) => {
  detailRef.value.open(data)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProductApi.deleteProduct(id)
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
    const data = await ProductApi.exportProduct(queryParams)
    download.excel(data, '产品.xls')
  } catch (e) {
    console.log(e)
  } finally {
    exportLoading.value = false
  }
}

const productCategoryList = ref([]) // 产品分类树
const userList = ref<UserVO[]>([]) // 系统用户

/** 初始化 **/
onMounted(async () => {
  await getList()
  productCategoryList.value = await ProductCategoryApi.getProductCategoryList({})
  userList.value = await getSimpleUserList()
})
</script>
