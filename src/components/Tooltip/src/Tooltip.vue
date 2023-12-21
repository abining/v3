<script lang="ts" setup>
import { propTypes } from '/@/utils/propTypes'

defineOptions({ name: 'Tooltip' })

defineProps({
  title: propTypes.string.def(''),
  message: propTypes.string.def(''),
  icon: propTypes.string.def('ep:question-filled'),
})
</script>
<template>
  <span>{{ title }}</span>
  <el-tooltip :content="message" placement="top">
    <icon class="relative top-1px ml-1px" :icon="icon" />
  </el-tooltip>
</template>
