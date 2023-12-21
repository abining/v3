<template>
  <el-dropdown class="vab-language" @command="handleCommand">
    <vab-icon icon="translate-2" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh">中文简体</el-dropdown-item>
        <el-dropdown-item command="en">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useI18n as useBaseI18n } from 'vue-i18n'
import { useSettingsStore } from '/@/store/modules/settings'
import getPageTitle from '/@/utils/pageTitle'

defineOptions({
  name: 'VabLanguage',
})

const { locale } = useBaseI18n()
const route = useRoute()
const settingsStore = useSettingsStore()
const { changeLanguage } = settingsStore

const handleCommand = (language: string) => {
  changeLanguage(language)
  locale.value = language
  document.title = getPageTitle(route.meta.title)
  if (route.path === '/login') location.reload()
}
</script>
