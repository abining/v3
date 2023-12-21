<template>
  <div
    class="title-bar"
    :style="{
      background: property.backgroundColor,
      borderBottom: property.showBottomBorder ? '1px solid #F9F9F9' : '1px solid #fff',
    }"
  >
    <div>
      <!-- 标题 -->
      <div
        v-if="property.title"
        :style="{
          fontSize: `${property.titleSize}px`,
          fontWeight: property.titleWeight,
          color: property.titleColor,
          textAlign: property.position,
        }"
      >
        {{ property.title }}
      </div>
      <!-- 副标题 -->
      <div
        v-if="property.description"
        class="m-t-8px"
        :style="{
          fontSize: `${property.descriptionSize}px`,
          fontWeight: property.descriptionWeight,
          color: property.descriptionColor,
          textAlign: property.position,
        }"
      >
        {{ property.description }}
      </div>
    </div>
    <!-- 更多 -->
    <div
      v-show="property.more.show"
      class="more"
      :style="{
        color: property.more.type === 'text' ? '#38f' : '',
      }"
    >
      {{ property.more.type === 'icon' ? '' : property.more.text }}
      <icon v-if="property.more.type !== 'text'" icon="ep:arrow-right" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { TitleBarProperty } from './config'

/** 标题栏 */
defineOptions({ name: 'TitleBar' })

defineProps<{ property: TitleBarProperty }>()
</script>
<style scoped lang="scss">
.title-bar {
  position: relative;
  width: 100%;
  min-height: 20px;
  padding: 8px 16px;
  border: 2px solid #fff;
  box-sizing: border-box;

  /* 更多 */
  .more {
    position: absolute;
    top: 0;
    right: 8px;
    bottom: 0;
    display: flex;
    margin: auto;
    font-size: 10px;
    color: #969799;
    align-items: center;
    justify-content: center;
  }
}
</style>
