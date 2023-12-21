import { useSettingsStore } from '/@/store/modules/settings'

export const useLocale = () => {
  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  const settingsStore = useSettingsStore()
  const { changeLanguage } = settingsStore

  const changeLocale = async (locale: LocaleType) => {
    changeLanguage(locale)
  }

  return {
    changeLocale,
  }
}
