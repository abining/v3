import { ref, watch } from 'vue'
import { isString } from '/@/utils/is'
import { useSettingsStore } from '/@/store/modules/settings'

const settingsStore = useSettingsStore()

export const useTitle = (newTitle?: string) => {
  const { t } = useI18n()
  const title = ref(newTitle ? `${settingsStore.getTitle} - ${t(newTitle as string)}` : settingsStore.getTitle)

  watch(
    title,
    (n, o) => {
      if (isString(n) && n !== o && document) {
        document.title = n
      }
    },
    { immediate: true }
  )

  return title
}
