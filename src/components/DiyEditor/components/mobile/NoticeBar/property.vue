<template>
  <el-form label-width="80px" :model="formData" :rules="rules">
    <el-form-item label="公告图标" prop="iconUrl">
      <upload-img v-model="formData.iconUrl" height="48px">
        <template #tip>建议尺寸：24 * 24</template>
      </upload-img>
    </el-form-item>
    <el-form-item label="背景颜色" prop="backgroundColor">
      <color-input v-model="formData.backgroundColor" />
    </el-form-item>
    <el-form-item label="文字颜色" prop="文字颜色">
      <color-input v-model="formData.textColor" />
    </el-form-item>
    <el-text tag="p">公告内容</el-text>
    <el-text size="small" type="info">拖动左上角的小圆点可以调整热词顺序</el-text>
    <template v-if="formData.contents.length">
      <vue-draggable :animation="200" class="m-t-8px" :force-fallback="true" handle=".drag-icon" item-key="index" :list="formData.contents">
        <template #item="{ element, index }">
          <div class="mb-4px flex flex-row gap-4px rounded bg-gray-100 p-8px">
            <div class="flex flex-col items-start justify-between">
              <icon class="drag-icon cursor-move" icon="ic:round-drag-indicator" />
              <icon
                v-if="formData.contents.length > 1"
                class="cursor-pointer text-red-5"
                icon="ep:delete"
                @click="handleDeleteContent(index)"
              />
            </div>
            <div class="w-full flex flex-col gap-8px">
              <el-input v-model="element.text" placeholder="请输入公告" />
              <app-link-input v-model="element.url" />
            </div>
          </div>
        </template>
      </vue-draggable>
    </template>
    <el-form-item label-width="0">
      <el-button class="m-t-8px w-full" plain type="primary" @click="handleAddContent">添加内容</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import VueDraggable from 'vuedraggable'
import { NoticeBarProperty, NoticeContentProperty } from './config'
import { usePropertyForm } from '/@/components/DiyEditor/util'
// 通知栏属性面板
defineOptions({ name: 'NoticeBarProperty' })
// 表单校验
const rules = {
  content: [{ required: true, message: '请输入公告', trigger: 'blur' }],
}

const props = defineProps<{ modelValue: NoticeBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)

/* 添加公告 */
const handleAddContent = () => {
  formData.value.contents.push({} as NoticeContentProperty)
}
/* 删除公告 */
const handleDeleteContent = (index: number) => {
  formData.value.contents.splice(index, 1)
}
</script>

<style scoped lang="scss"></style>
