<template>
  <component-container-property v-model="formData.style">
    <el-text tag="p">搜索热词</el-text>
    <el-text size="small" type="info">拖动左侧的小圆点可以调整热词顺序</el-text>

    <!-- 表单 -->
    <el-form class="m-t-8px" label-width="80px" :model="formData">
      <div v-if="formData.hotKeywords.length">
        <vue-draggable :animation="200" :force-fallback="true" handle=".drag-icon" item-key="index" :list="formData.hotKeywords">
          <template #item="{ index }">
            <div class="mb-4px flex flex-row items-center gap-4px rounded bg-gray-100 p-8px">
              <icon class="drag-icon cursor-move" icon="ic:round-drag-indicator" />
              <el-input v-model="formData.hotKeywords[index]" placeholder="请输入热词" />
              <icon class="text-red-500" icon="ep:delete" @click="deleteHotWord(index)" />
            </div>
          </template>
        </vue-draggable>
      </div>
      <el-form-item label-width="0">
        <el-button class="m-t-8px w-full" plain type="primary" @click="handleAddHotWord">添加热词</el-button>
      </el-form-item>
      <el-form-item label="框体样式">
        <el-radio-group v-model="formData!.borderRadius">
          <el-tooltip content="方形" placement="top">
            <el-radio-button :label="0">
              <icon icon="tabler:input-search" />
            </el-radio-button>
          </el-tooltip>
          <el-tooltip content="圆形" placement="top">
            <el-radio-button :label="10">
              <icon icon="iconoir:input-search" />
            </el-radio-button>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提示文字" prop="placeholder">
        <el-input v-model="formData.placeholder" />
      </el-form-item>
      <el-form-item label="文本位置" prop="placeholderPosition">
        <el-radio-group v-model="formData!.placeholderPosition">
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
      <el-form-item label="扫一扫" prop="showScan">
        <el-switch v-model="formData!.showScan" />
      </el-form-item>
      <el-form-item label="框体高度" prop="height">
        <el-slider v-model="formData!.height" input-size="small" :max="50" :min="28" show-input />
      </el-form-item>
      <el-form-item label="框体颜色" prop="backgroundColor">
        <color-input v-model="formData.backgroundColor" />
      </el-form-item>
      <el-form-item class="lef" label="文本颜色" prop="textColor">
        <color-input v-model="formData.textColor" />
      </el-form-item>
    </el-form>
  </component-container-property>
</template>

<script setup lang="ts">
import VueDraggable from 'vuedraggable'
import { SearchProperty } from '/@/components/DiyEditor/components/mobile/SearchBar/config'
import { usePropertyForm } from '/@/components/DiyEditor/util'

/** 搜索框属性面板 */
defineOptions({ name: 'SearchProperty' })

const props = defineProps<{ modelValue: SearchProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)

/* 添加热词 */
const handleAddHotWord = () => {
  formData.value.hotKeywords.push('')
}
/* 删除热词 */
const deleteHotWord = (index: number) => {
  formData.value.hotKeywords.splice(index, 1)
}
</script>

<style scoped lang="scss"></style>
