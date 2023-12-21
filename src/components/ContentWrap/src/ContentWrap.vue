<script lang="ts" setup>
import { useDesign } from '/@/hooks/web/useDesign'
import { propTypes } from '/@/utils/propTypes'

defineOptions({ name: 'ContentWrap' })

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('content-wrap')

defineProps({
  title: propTypes.string.def(''),
  message: propTypes.string.def(''),
})
</script>

<template>
  <el-card :class="[prefixCls, 'mb-15px']" shadow="never">
    <template v-if="title" #header>
      <div class="flex items-center">
        <span class="text-16px font-700">{{ title }}</span>
        <el-tooltip v-if="message" effect="dark" placement="right">
          <template #content>
            <div class="max-w-200px">{{ message }}</div>
          </template>
          <icon class="ml-5px" icon="ep:question-filled" :size="14" />
        </el-tooltip>
      </div>
    </template>
    <div>
      <slot></slot>
    </div>
  </el-card>
</template>
