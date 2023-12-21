<template>
  <router-view>
    <template #default="{ Component }">
      <transition mode="out-in" :name="theme.pageTransition">
        <keep-alive :include="getCaches" :max="keepAliveMaxNum">
          <div v-show="componentRef">
            <component :is="Component" :key="routerKey" ref="componentRef" />
          </div>
        </keep-alive>
      </transition>
    </template>
  </router-view>
</template>

<script lang="ts" setup>
import { useHead } from '@vueuse/head'
import VabProgress from 'nprogress'
import { keepAliveMaxNum } from '/@/config'
import { useSettingsStore } from '/@/store/modules/settings'
import { useTabsStore } from '/@/store/modules/tabs'
import { handleActivePath } from '/@/utils/routes'
import { useTagsViewStore } from '/@/store/modules/tagsView'

defineOptions({
  name: 'VabRouterView',
})

const route = useRoute()
const $sub = inject<any>('$sub')
const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)
const tabsStore = useTabsStore()
const { getVisitedRoutes: visitedRoutes } = storeToRefs(tabsStore)
const componentRef = ref<any>()
const routerKey = ref<number>(0)
const keepAliveNameList = ref<any>()
const siteData = reactive<any>({
  description: '',
})
const tagsViewStore = useTagsViewStore()
const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})
useHead({
  meta: [
    {
      name: `description`,
      content: computed(() => siteData.description),
    },
  ],
})

const updateKeepAliveNameList = (refreshRouteName = null) => {
  keepAliveNameList.value = visitedRoutes.value
    .filter((item) => !item.meta.noKeepAlive && item.name !== refreshRouteName)
    .flatMap((item) => item.name)
}

// 更新KeepAlive缓存页面
watch(
  () => route.fullPath,
  () => {
    routerKey.value = handleActivePath(route, true)
    updateKeepAliveNameList()
    siteData.description = `${settingsStore.title}-${route.meta.title}`
  }
)

onBeforeMount(() => {
  $sub('reload-router-view', (refreshRouteName: any = route.name) => {
    if (theme.value.showProgressBar) VabProgress.start()
    const cacheActivePath = routerKey.value
    routerKey.value = null
    updateKeepAliveNameList(refreshRouteName)
    nextTick(() => {
      routerKey.value = cacheActivePath
      updateKeepAliveNameList()
    })
    useTimeoutFn(() => {
      if (theme.value.showProgressBar) VabProgress.done()
    }, 200)
  })
})
</script>
