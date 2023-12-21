<template>
  <div class="flex flex-col gap-2 bg-[var(--el-bg-color-overlay)] p-6">
    <div class="flex items-center justify-between text-gray-500">
      <span>{{ title }}</span>
      <el-tooltip v-if="tooltip" :content="tooltip" placement="top-start">
        <Icon icon="ep:warning" />
      </el-tooltip>
    </div>
    <div class="mb-4 text-3xl">
      <CountTo :decimals="decimals" :end-val="value" :prefix="prefix" />
    </div>
    <div class="flex flex-row gap-1 text-sm">
      <span class="text-gray-500">环比</span>
      <span :class="toNumber(percent) > 0 ? 'text-red-500' : 'text-green-500'">
        {{ Math.abs(toNumber(percent)) }}%
        <Icon class="!text-sm" :icon="toNumber(percent) > 0 ? 'ep:caret-top' : 'ep:caret-bottom'" />
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toNumber } from 'lodash-es'
import { propTypes } from '/@/utils/propTypes'

/** 交易统计值组件 */
defineOptions({ name: 'TradeStatisticValue' })

defineProps({
  tooltip: propTypes.string.def(''),
  title: propTypes.string.def(''),
  prefix: propTypes.string.def(''),
  value: propTypes.number.def(0),
  decimals: propTypes.number.def(0),
  percent: propTypes.oneOfType([Number, String]).def(0),
})
</script>
