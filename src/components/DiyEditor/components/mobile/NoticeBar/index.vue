<template>
  <div class="flex items-center p-y-4px text-12px" :style="{ backgroundColor: property.backgroundColor, color: property.textColor }">
    <el-image class="h-18px" :src="property.iconUrl" />
    <el-divider direction="vertical" />
    <el-carousel :autoplay="true" class="flex-1 p-r-8px" direction="vertical" height="24px">
      <el-carousel-item v-for="(item, index) in property.contents" :key="index">
        <div class="h-24px truncate leading-24px">{{ item.text }}</div>
      </el-carousel-item>
    </el-carousel>
    <icon icon="ep:arrow-right" />
  </div>
</template>

<script setup lang="ts">
import { NoticeBarProperty } from './config'

/** 公告栏 */
defineOptions({ name: 'NoticeBar' })

defineProps<{ property: NoticeBarProperty }>()
</script>

<style scoped lang="scss"></style>
