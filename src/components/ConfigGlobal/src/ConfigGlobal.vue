<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ComponentSize, ElConfigProvider } from 'element-plus'
import { computed, onMounted, provide, watch } from 'vue'
import { useDesign } from '/@/hooks/web/useDesign'
import { useAppStore } from '/@/store/modules/app'
import { useLocaleStore } from '/@/store/modules/locale'
import { setCssVar } from '/@/utils'
import { propTypes } from '/@/utils/propTypes'

const { variables } = useDesign()

const appStore = useAppStore()

const props = defineProps({
  size: propTypes.oneOf<ComponentSize>(['default', 'small', 'large']).def('default'),
})

provide('configGlobal', props)

// 初始化所有主题色
onMounted(() => {
  appStore.setCssVarTheme()
})

const { width } = useWindowSize()

// 监听窗口变化
watch(
  () => width.value,
  (width: number) => {
    if (width < 768) {
      !appStore.getMobile ? appStore.setMobile(true) : undefined
      setCssVar('--left-menu-min-width', '0')
      appStore.setCollapse(true)
      appStore.getLayout !== 'classic' ? appStore.setLayout('classic') : undefined
    } else {
      appStore.getMobile ? appStore.setMobile(false) : undefined
      setCssVar('--left-menu-min-width', '64px')
    }
  },
  {
    immediate: true,
  }
)

// 多语言相关
const localeStore = useLocaleStore()

const currentLocale = computed(() => localeStore.currentLocale)
</script>

<template>
  <el-config-provider :locale="currentLocale.elLocale" :message="{ max: 1 }" :namespace="variables.elNamespace" :size="size">
    <slot></slot>
  </el-config-provider>
</template>
