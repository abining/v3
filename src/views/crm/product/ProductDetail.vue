<template>
  <Dialog v-model="dialogVisible" :max-height="500" :scroll="true" title="产品详情">
    <el-descriptions border :column="1">
      <el-descriptions-item label="产品名称">
        {{ detailData.name }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <dict-tag :type="DICT_TYPE.CRM_PRODUCT_STATUS" :value="detailData.status" />
      </el-descriptions-item>
      <el-descriptions-item label="产品分类">
        {{ productCategoryList?.find((c) => c.id === detailData.categoryId)?.name }}
      </el-descriptions-item>
      <el-descriptions-item label="产品编码">
        {{ detailData.no }}
      </el-descriptions-item>
      <el-descriptions-item label="产品描述">
        {{ detailData.description }}
      </el-descriptions-item>
      <el-descriptions-item label="负责人">
        {{ detailData.ownerUserId }}
      </el-descriptions-item>
      <el-descriptions-item label="单位">
        <dict-tag :type="DICT_TYPE.PRODUCT_UNIT" :value="detailData.unit" />
      </el-descriptions-item>
      <el-descriptions-item label="价格">{{ fenToYuan(detailData.price) }}元</el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script setup lang="ts">
import * as ProductApi from '/@/api/crm/product/index'
import * as ProductCategoryApi from '/@/api/crm/product/productCategory'
import { getSimpleUserList, UserVO } from '/@/api/system/user'
import { fenToYuan } from '/@/utils'
import { DICT_TYPE } from '/@/utils/dict'
import { formatDate } from '/@/utils/formatTime'

defineOptions({ name: 'CrmProductDetail' })

// const { t } = useI18n() // 国际化

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中
const detailData = ref() // 详情数据

/** 打开弹窗 */
const open = async (data: ProductApi.ProductVO) => {
  dialogVisible.value = true
  // 设置数据
  detailLoading.value = true
  try {
    detailData.value = data
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const productCategoryList = ref([]) // 产品分类树
const userList = ref<UserVO[]>([]) // 系统用户

onMounted(async () => {
  productCategoryList.value = await ProductCategoryApi.getProductCategoryList({})
  userList.value = await getSimpleUserList()
})
</script>
