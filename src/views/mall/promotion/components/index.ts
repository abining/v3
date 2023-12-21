import SpuAndSkuList from './SpuAndSkuList.vue'
import SpuSelect from './SpuSelect.vue'
import { PropertyAndValues } from '/@/views/mall/product/spu/components'

type SpuProperty<T> = {
  spuId: number
  spuDetail: T
  propertyList: PropertyAndValues[]
}

/**
 * 提供商品活动商品选择通用组件
 */
export { SpuAndSkuList, SpuProperty, SpuSelect }
