<template>
  <div class="w-full" :style="{ height: `${property.style.height}px` }">
    <el-image v-if="property.posterUrl" class="w-full w-full" :src="property.posterUrl" />
    <video
      v-else
      :autoplay="property.autoplay"
      class="w-full w-full"
      controls
      :poster="property.posterUrl"
      :src="property.videoUrl"
    ></video>
  </div>
</template>
<script setup lang="ts">
import { VideoPlayerProperty } from './config'

/** 视频播放 */
defineOptions({ name: 'VideoPlayer' })

defineProps<{ property: VideoPlayerProperty }>()
</script>

<style scoped lang="scss">
/* 图片 */
img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
