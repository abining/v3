<template>
  <component :is="menuComponent" :item-or-menu="item" :path="path">
    <template v-if="item.children && item.children.length">
      <vab-menu v-for="route in item.children" :key="route.path" :item="route" :parent="path" />
    </template>
  </component>
</template>

<script lang="ts" setup>
import { getRedirect } from '/@/utils/routerHelper'
defineOptions({
  name: 'VabMenu',
})

interface ComponentType {
  default: Component
}

const imports = import.meta.glob<ComponentType>('./**/*.vue', { eager: true })
const Components: Record<string, Component> = {}
Object.getOwnPropertyNames(imports).forEach((key) => {
  Components[key.replace(/(\/|components|\.|vue)/g, '')] = imports[key].default
})

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  parent: {
    type: String,
    required: false,
    default: '',
  },
  layout: {
    type: String,
    default: '',
  },
})
const path = getRedirect(props.parent || '', [{ ...props.item, children: undefined }] as AppCustomRouteRecordRaw[])

const menuComponent = computed(() =>
  props.item.children &&
  props.item.children.some((route: any) => {
    return route.meta && route.meta.hidden !== true
  })
    ? Components['VabSubMenu']
    : Components['VabMenuItem']
)
</script>
