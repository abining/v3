<template>
  <el-tree-select
    v-model="selectCategoryId"
    class="w-1/1"
    :data="categoryList"
    :multiple="multiple"
    node-key="id"
    placeholder="请选择商品分类"
    :props="defaultProps"
    :show-checkbox="multiple"
  />
</template>
<script lang="ts" setup>
import { oneOfType } from 'vue-types'
import * as ProductCategoryApi from '/@/api/mall/product/category'
import { propTypes } from '/@/utils/propTypes'
import { defaultProps, handleTree } from '/@/utils/tree'

/** 商品分类选择组件 */
defineOptions({ name: 'ProductCategorySelect' })

const props = defineProps({
  // 选中的ID
  modelValue: oneOfType<number | number[]>([Number, Array<number>]),
  // 是否多选
  multiple: propTypes.bool.def(false),
  // 上级品类的编号
  parentId: propTypes.number.def(undefined),
})

/** 选中的分类 ID */
const selectCategoryId = computed({
  get: () => {
    return props.modelValue
  },
  set: (val: number | number[]) => {
    emit('update:modelValue', val)
  },
})

/** 分类选择 */
const emit = defineEmits(['update:modelValue'])

/** 初始化 **/
const categoryList = ref<ProductCategoryApi.CategoryVO[]>([]) // 分类树
onMounted(async () => {
  // 获得分类树
  const data = await ProductCategoryApi.getCategoryList({ parentId: props.parentId })
  categoryList.value = handleTree(data, 'id', 'parentId')
})
</script>
