import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { defineStore } from 'pinia'
import store from '../index'
import { useSettingsStore } from './settings'
import { CACHE_KEY, useCache } from '/@/hooks/web/useCache'
import { LocaleDropdownType } from '/@/types/localeDropdown'

const { wsCache } = useCache()

const elLocaleMap = {
  'zh-CN': zhCn,
  en: en,
}
interface LocaleState {
  currentLocale: LocaleDropdownType
  localeMap: LocaleDropdownType[]
}

export const useLocaleStore = defineStore('locales', {
  state: (): LocaleState => {
    const settingsStore = useSettingsStore(store)
    const language = settingsStore.getLanguage
    const lang = ({
      zh: 'zh-CN',
      en: 'en',
    }[language] || 'zh-CN') as LocaleType
    return {
      currentLocale: {
        lang: lang,
        elLocale: elLocaleMap[lang],
      },
      // 多语言
      localeMap: [
        {
          lang: 'zh-CN',
          name: '简体中文',
        },
        {
          lang: 'en',
          name: 'English',
        },
      ],
    }
  },
  getters: {
    getCurrentLocale(): LocaleDropdownType {
      const settingsStore = useSettingsStore(store)
      const language = settingsStore.getLanguage
      const lang = ({
        zh: 'zh-CN',
        en: 'en',
      }[language] || 'zh-CN') as LocaleType
      return {
        lang: lang,
        elLocale: elLocaleMap[lang],
      }
    },
    getLocaleMap(): LocaleDropdownType[] {
      return this.localeMap
    },
  },
  actions: {
    setCurrentLocale(localeMap: LocaleDropdownType) {
      // this.locale = Object.assign(this.locale, localeMap)
      if (elLocaleMap[localeMap?.lang]) {
        this.currentLocale.lang = localeMap?.lang
        this.currentLocale.elLocale = elLocaleMap[localeMap?.lang]
        const settingsStore = useSettingsStore(store)
        settingsStore.changeLanguage({ 'zh-CN': 'zh', en: 'en' }[localeMap?.lang])
        wsCache.set(CACHE_KEY.LANG, localeMap?.lang)
      }
    },
  },
})

export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store)
}
