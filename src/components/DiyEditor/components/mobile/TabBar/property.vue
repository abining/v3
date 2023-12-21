<template>
  <div class="tab-bar">
    <!-- 表单 -->
    <el-form label-width="80px" :model="formData">
      <el-form-item label="主题" prop="theme">
        <el-select v-model="formData!.theme" @change="handleThemeChange">
          <el-option v-for="(theme, index) in THEME_LIST" :key="index" :label="theme.name" :value="theme.id">
            <template #default>
              <div class="flex items-center justify-between">
                <icon :color="theme.color" :icon="theme.icon" />
                <span>{{ theme.name }}</span>
              </div>
            </template>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认颜色">
        <color-input v-model="formData!.style.color" />
      </el-form-item>
      <el-form-item label="选中颜色">
        <color-input v-model="formData!.style.activeColor" />
      </el-form-item>
      <el-form-item label="导航背景">
        <el-radio-group v-model="formData!.style.bgType">
          <el-radio-button label="color">纯色</el-radio-button>
          <el-radio-button label="img">图片</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData!.style.bgType === 'color'" label="选择颜色">
        <color-input v-model="formData!.style.bgColor" />
      </el-form-item>
      <el-form-item v-if="formData!.style.bgType === 'img'" label="选择图片">
        <upload-img v-model="formData!.style.bgImg" class="min-w-200px" height="50px" width="100%">
          <template #tip>建议尺寸 375 * 50</template>
        </upload-img>
      </el-form-item>

      <el-text tag="p">图标设置</el-text>
      <el-text size="small" type="info">拖动左上角的小圆点可对其排序, 图标建议尺寸 44*44</el-text>
      <draggable :animation="200" class="m-t-8px" :force-fallback="true" handle=".drag-icon" item-key="index" :list="formData!.items">
        <template #item="{ element, index }">
          <div class="mb-4px flex flex-row gap-4px rounded bg-gray-100 p-8px">
            <div class="flex flex-col items-start justify-between">
              <icon class="drag-icon cursor-move" icon="ic:round-drag-indicator" />
              <icon v-if="formData.items.length > 1" class="cursor-pointer text-red-5" icon="ep:delete" @click="handleDeleteItem(index)" />
            </div>
            <div class="w-full flex flex-col">
              <div class="m-b-8px flex items-center justify-around">
                <div class="flex flex-col items-center justify-between">
                  <upload-img v-model="element.iconUrl" height="40px" :show-btn-text="false" :show-delete="false" width="40px" />
                  <el-text size="small">默认图片</el-text>
                </div>
                <div>
                  <upload-img v-model="element.activeIconUrl" height="40px" :show-btn-text="false" :show-delete="false" width="40px" />
                  <el-text>选中图片</el-text>
                </div>
              </div>
              <el-form-item class="m-b-8px!" label-width="0" prop="text">
                <el-input v-model="element.text" placeholder="请输入文字" />
              </el-form-item>
              <el-form-item class="m-b-0!" label-width="0" prop="url">
                <app-link-input v-model="element.url" />
              </el-form-item>
            </div>
          </div>
        </template>
      </draggable>

      <el-form-item label-width="0">
        <!-- 添加导航按钮 -->
        <el-tooltip content="最多添加5个">
          <el-button class="m-b-16px w-full" :disabled="formData!.items.length >= 5" plain type="primary" @click="handleAddItem">
            添加导航
          </el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable' //拖拽组件
import { TabBarItemProperty, TabBarProperty, THEME_LIST } from './config'
import { usePropertyForm } from '/@/components/DiyEditor/util'
// 底部导航栏
defineOptions({ name: 'TabBarProperty' })

const props = defineProps<{ modelValue: TabBarProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)

/** 添加导航项 */
const handleAddItem = () => {
  formData?.value?.items?.push({} as TabBarItemProperty)
}
/** 删除导航项 */
const handleDeleteItem = (index: number) => {
  formData?.value?.items?.splice(index, 1)
}

// 要的主题
const handleThemeChange = () => {
  const theme = THEME_LIST.find((theme) => theme.id === formData.value.theme)
  if (theme?.color) {
    formData.value.style.activeColor = theme.color
  }
}
</script>

<style lang="scss" scoped></style>
