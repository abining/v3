<template>
  <Dialog v-model="dialogVisible" :append-to-body="true" title="选择规格" width="700">
    <el-table v-loading="loading" :data="list" show-overflow-tooltip>
      <el-table-column label="#" width="55">
        <template #default="{ row }">
          <el-radio v-model="selectedSkuId" :label="row.id" @change="handleSelected(row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="80">
        <template #default="{ row }">
          <el-image class="h-30px w-30px" :preview-src-list="[row.picUrl]" preview-teleported :src="row.picUrl" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="规格" min-width="80">
        <template #default="{ row }">
          {{ row.properties?.map((p) => p.valueName)?.join(' ') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售价(元)" min-width="80">
        <template #default="{ row }">
          {{ fenToYuan(row.price) }}
        </template>
      </el-table-column>
    </el-table>
  </Dialog>
</template>

<script lang="ts" setup>
import { ElTable } from 'element-plus'
import * as ProductSpuApi from '/@/api/mall/product/spu'
import { fenToYuan } from '/@/utils'
import { propTypes } from '/@/utils/propTypes'

defineOptions({ name: 'SkuTableSelect' })

const props = defineProps({
  spuId: propTypes.number.def(null),
})

// const message = useMessage() // 消息弹窗
const list = ref<any[]>([]) // 列表的数据
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示

const selectedSkuId = ref() // 选中的商品 spuId

/** 选中时触发 */
const handleSelected = (row: ProductSpuApi.Sku) => {
  emits('change', row)
  // 关闭弹窗
  dialogVisible.value = false
  selectedSkuId.value = undefined
}

// 确认选择时的触发事件
const emits = defineEmits<{
  (e: 'change', spu: ProductSpuApi.Sku): void
}>()

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getSpuDetail = async () => {
  loading.value = true
  try {
    const spu = await ProductSpuApi.getSpu(props.spuId)
    list.value = spu.skus
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {})
watch(
  () => props.spuId,
  () => {
    if (!props.spuId) {
      return
    }
    getSpuDetail()
  }
)
</script>
