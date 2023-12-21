<template>
  <component-container-property v-model="formData.style">
    <el-form label-width="80px" :model="formData">
      <el-form-item label="上传图片" prop="imgUrl">
        <upload-img v-model="formData.imgUrl" class="min-w-80px" draggable="false" height="80px" width="100%">
          <template #tip>建议宽度750</template>
        </upload-img>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <app-link-input v-model="formData.url" />
      </el-form-item>
    </el-form>
  </component-container-property>
</template>

<script setup lang="ts">
import { ImageBarProperty } from './config'
import { usePropertyForm } from '/@/components/DiyEditor/util'

// 图片展示属性面板
defineOptions({ name: 'ImageBarProperty' })

const props = defineProps<{ modelValue: ImageBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)
</script>

<style scoped lang="scss"></style>
