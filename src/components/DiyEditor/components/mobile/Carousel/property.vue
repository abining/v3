<template>
  <component-container-property v-model="formData.style">
    <el-form label-width="80px" :model="formData">
      <el-card class="property-group" header="样式设置" shadow="never">
        <el-form-item label="样式" prop="type">
          <el-radio-group v-model="formData.type">
            <el-tooltip class="item" content="默认" placement="bottom">
              <el-radio-button label="default">
                <icon icon="system-uicons:carousel" />
              </el-radio-button>
            </el-tooltip>
            <el-tooltip class="item" content="卡片" placement="bottom">
              <el-radio-button label="card">
                <icon icon="ic:round-view-carousel" />
              </el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指示器" prop="indicator">
          <el-radio-group v-model="formData.indicator">
            <el-radio label="dot">小圆点</el-radio>
            <el-radio label="number">数字</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否轮播" prop="autoplay">
          <el-switch v-model="formData.autoplay" />
        </el-form-item>
        <el-form-item v-if="formData.autoplay" label="播放间隔" prop="interval">
          <el-slider
            v-model="formData.interval"
            input-size="small"
            :max="10"
            :min="0.5"
            show-input
            :show-input-controls="false"
            :step="0.5"
          />
          <el-text type="info">单位：秒</el-text>
        </el-form-item>
      </el-card>
      <el-card class="property-group" header="内容设置" shadow="never">
        <el-text size="small" type="info">拖动左上角的小圆点可对其排序</el-text>
        <template v-if="formData.items[0]">
          <draggable :animation="200" class="m-t-8px" :force-fallback="true" handle=".drag-icon" item-key="index" :list="formData.items">
            <template #item="{ element, index }">
              <div class="content mb-4px flex flex-col gap-4px rounded bg-gray-50 p-8px">
                <div class="m--8px m-b-8px flex flex-row items-center justify-between bg-gray-100 p-8px">
                  <icon class="drag-icon cursor-move" icon="ic:round-drag-indicator" />
                  <icon
                    v-if="formData.items.length > 1"
                    class="cursor-pointer text-red-5"
                    icon="ep:delete"
                    @click="handleDeleteImage(index)"
                  />
                </div>
                <el-form-item class="m-b-8px!" label="类型" label-width="50px" prop="type">
                  <el-radio-group v-model="element.type">
                    <el-radio label="img">图片</el-radio>
                    <el-radio label="video">视频</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="element.type === 'img'" class="m-b-8px!" label="图片" label-width="50px">
                  <upload-img v-model="element.imgUrl" class="min-w-80px" draggable="false" height="80px" width="100%" />
                </el-form-item>
                <template v-else>
                  <el-form-item class="m-b-8px!" label="封面" label-width="50px">
                    <upload-img v-model="element.imgUrl" class="min-w-80px" draggable="false" height="80px" width="100%" />
                  </el-form-item>
                  <el-form-item class="m-b-8px!" label="视频" label-width="50px">
                    <upload-file v-model="element.videoUrl" class="min-w-80px" :file-size="100" :file-type="['mp4']" :limit="1" />
                  </el-form-item>
                </template>
                <el-form-item class="m-b-8px!" label="链接" label-width="50px">
                  <app-link-input v-model="element.url" />
                </el-form-item>
              </div>
            </template>
          </draggable>
        </template>
        <el-button class="w-full" plain type="primary" @click="handleAddImage">添加图片</el-button>
      </el-card>
    </el-form>
  </component-container-property>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable' //拖拽组件
import { CarouselItemProperty, CarouselProperty } from './config'
import { usePropertyForm } from '/@/components/DiyEditor/util'

// 轮播图属性面板
defineOptions({ name: 'CarouselProperty' })

const props = defineProps<{ modelValue: CarouselProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)

// 添加图片
const handleAddImage = () => {
  formData.value.items.push({} as CarouselItemProperty)
}
// 删除图片
const handleDeleteImage = (index: number) => {
  formData.value.items.splice(index, 1)
}
</script>

<style scoped lang="scss"></style>
