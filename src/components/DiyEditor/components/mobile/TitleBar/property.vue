<template>
  <section class="title-bar">
    <el-form label-width="85px" :model="formData" :rules="rules">
      <el-form-item label="主标题" prop="title">
        <el-input v-model="formData.title" maxlength="20" placeholder="请输入主标题" show-word-limit />
      </el-form-item>
      <el-form-item label="副标题" prop="description">
        <el-input v-model="formData.description" maxlength="50" placeholder="请输入副标题" show-word-limit type="textarea" />
      </el-form-item>
      <el-form-item label="显示位置" prop="position">
        <el-radio-group v-model="formData!.position">
          <el-tooltip content="居左" placement="top">
            <el-radio-button label="left">
              <icon icon="ant-design:align-left-outlined" />
            </el-radio-button>
          </el-tooltip>
          <el-tooltip content="居中" placement="top">
            <el-radio-button label="center">
              <icon icon="ant-design:align-center-outlined" />
            </el-radio-button>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题大小" prop="titleSize">
        <el-slider v-model="formData.titleSize" input-size="small" :max="60" :min="10" show-input />
      </el-form-item>
      <el-form-item label="副标题大小" prop="descriptionSize">
        <el-slider v-model="formData.descriptionSize" input-size="small" :max="60" :min="10" show-input />
      </el-form-item>
      <el-form-item label="标题粗细" prop="titleWeight">
        <el-slider v-model="formData.titleWeight" input-size="small" :max="900" :min="100" show-input :step="100" />
      </el-form-item>
      <el-form-item label="副标题粗细" prop="descriptionWeight">
        <el-slider v-model="formData.descriptionWeight" input-size="small" :max="900" :min="100" show-input :step="100" />
      </el-form-item>
      <el-form-item label="标题颜色" prop="titleColor">
        <color-input v-model="formData.titleColor" />
      </el-form-item>
      <el-form-item label="副标题颜色" prop="descriptionColor">
        <color-input v-model="formData.descriptionColor" />
      </el-form-item>
      <el-form-item label="背景颜色" prop="backgroundColor">
        <color-input v-model="formData.backgroundColor" />
      </el-form-item>
      <el-form-item label="底部分割线" prop="showBottomBorder">
        <el-switch v-model="formData!.showBottomBorder" />
      </el-form-item>
      <el-form-item label="查看更多" prop="more.show">
        <el-checkbox v-model="formData.more.show" />
      </el-form-item>
      <!-- 更多样式选择 -->
      <template v-if="formData.more.show">
        <el-form-item label="样式" prop="more.type">
          <el-radio-group v-model="formData.more.type">
            <el-radio label="text">文字</el-radio>
            <el-radio label="icon">图标</el-radio>
            <el-radio label="all">文字+图标</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="formData.more.type !== 'icon'" label="更多文字" prop="more.text">
          <el-input v-model="formData.more.text" />
        </el-form-item>
        <el-form-item label="跳转链接" prop="more.url">
          <app-link-input v-model="formData.more.url" />
        </el-form-item>
      </template>
    </el-form>
  </section>
</template>
<script setup lang="ts">
import { TitleBarProperty } from './config'
import { usePropertyForm } from '/@/components/DiyEditor/util'
// 导航栏属性面板
defineOptions({ name: 'TitleBarProperty' })

const props = defineProps<{ modelValue: TitleBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)

// 表单校验
const rules = {}
</script>

<style scoped lang="scss"></style>
