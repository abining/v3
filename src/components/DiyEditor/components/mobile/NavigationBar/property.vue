<template>
  <el-form label-width="80px" :model="formData" :rules="rules">
    <el-form-item label="页面标题" prop="title">
      <el-input v-model="formData!.title" maxlength="25" placeholder="页面标题" show-word-limit />
    </el-form-item>
    <el-form-item label="页面描述" prop="description">
      <el-input v-model="formData!.description" placeholder="用户通过微信分享给朋友时，会自动显示页面描述" type="textarea" />
    </el-form-item>
    <el-form-item label="样式" prop="styleType">
      <el-radio-group v-model="formData!.styleType">
        <el-radio label="default">默认</el-radio>
        <el-radio label="immersion">沉浸式</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="formData.styleType === 'immersion'" label="常驻显示" prop="alwaysShow">
      <el-radio-group v-model="formData!.alwaysShow">
        <el-radio :label="false">关闭</el-radio>
        <el-radio :label="true">开启</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="高度" prop="navBarHeight">
      <el-slider v-model="formData!.navBarHeight" input-size="small" :max="100" :min="35" show-input />
    </el-form-item>
    <el-form-item label="返回按钮" prop="showGoBack">
      <el-switch v-model="formData!.showGoBack" />
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
import { NavigationBarProperty } from './config'
import { usePropertyForm } from '/@/components/DiyEditor/util'
// 导航栏属性面板
defineOptions({ name: 'NavigationBarProperty' })
// 表单校验
const rules = {
  name: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
}

const props = defineProps<{ modelValue: NavigationBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)
</script>

<style scoped lang="scss"></style>
