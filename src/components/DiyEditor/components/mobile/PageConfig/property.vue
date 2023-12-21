<template>
  <el-form label-width="80px" :model="formData" :rules="rules">
    <el-form-item label="页面描述" prop="description">
      <el-input v-model="formData!.description" placeholder="用户通过微信分享给朋友时，会自动显示页面描述" type="textarea" />
    </el-form-item>
    <el-form-item label="背景颜色" prop="backgroundColor">
      <color-input v-model="formData!.backgroundColor" />
    </el-form-item>
    <el-form-item label="背景图片" prop="backgroundImage">
      <upload-img v-model="formData!.backgroundImage" :limit="1">
        <template #tip>建议宽度 750px</template>
      </upload-img>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { PageConfigProperty } from './config'
import { usePropertyForm } from '/@/components/DiyEditor/util'
// 导航栏属性面板
defineOptions({ name: 'PageConfigProperty' })
// 表单校验
const rules = {}

const props = defineProps<{ modelValue: PageConfigProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)
</script>

<style scoped lang="scss"></style>
