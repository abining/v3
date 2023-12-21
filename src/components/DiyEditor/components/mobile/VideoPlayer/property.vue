<template>
  <component-container-property v-model="formData.style">
    <template #style="{ formData: innerFormData }">
      <el-form-item label="高度" prop="height">
        <el-slider v-model="innerFormData.height" input-size="small" :max="500" :min="100" show-input :show-input-controls="false" />
      </el-form-item>
    </template>
    <el-form label-width="80px" :model="formData">
      <el-form-item label="上传视频" prop="videoUrl">
        <upload-file v-model="formData.videoUrl" class="min-w-80px" :file-size="100" :file-type="['mp4']" :limit="1" />
      </el-form-item>
      <el-form-item label="上传封面" prop="posterUrl">
        <upload-img v-model="formData.posterUrl" class="min-w-80px" draggable="false" height="80px" width="100%">
          <template #tip>建议宽度750</template>
        </upload-img>
      </el-form-item>
      <el-form-item label="自动播放" prop="autoplay">
        <el-switch v-model="formData.autoplay" />
      </el-form-item>
    </el-form>
  </component-container-property>
</template>

<script setup lang="ts">
import { VideoPlayerProperty } from './config'
import { usePropertyForm } from '/@/components/DiyEditor/util'

// 视频播放属性面板
defineOptions({ name: 'VideoPlayerProperty' })

const props = defineProps<{ modelValue: VideoPlayerProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)
</script>

<style scoped lang="scss"></style>
