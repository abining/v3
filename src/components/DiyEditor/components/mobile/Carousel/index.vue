<template>
  <!-- 无图片 -->
  <div v-if="property.items.length === 0" class="h-250px flex items-center justify-center bg-gray-3">
    <icon class="text-gray-8 text-120px!" icon="tdesign:image" />
  </div>
  <div v-else class="relative">
    <el-carousel
      :autoplay="property.autoplay"
      height="174px"
      :indicator-position="property.indicator === 'number' ? 'none' : undefined"
      :interval="property.interval * 1000"
      :type="property.type === 'card' ? 'card' : ''"
      @change="handleIndexChange"
    >
      <el-carousel-item v-for="(item, index) in property.items" :key="index">
        <el-image class="h-full w-full" :src="item.imgUrl" />
      </el-carousel-item>
    </el-carousel>
    <div
      v-if="property.indicator === 'number'"
      class="absolute bottom-10px right-10px rounded-xl bg-black p-x-8px p-y-2px text-10px text-white opacity-40"
    >
      {{ currentIndex }} / {{ property.items.length }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { CarouselProperty } from './config'

/** 轮播图 */
defineOptions({ name: 'Carousel' })

defineProps<{ property: CarouselProperty }>()

const currentIndex = ref(0)
const handleIndexChange = (index: number) => {
  currentIndex.value = index + 1
}
</script>

<style scoped lang="scss"></style>
