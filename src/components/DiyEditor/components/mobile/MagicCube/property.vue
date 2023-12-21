<template>
  <component-container-property v-model="formData.style">
    <!-- 表单 -->
    <el-form class="m-t-8px" label-width="80px" :model="formData">
      <el-text tag="p">魔方设置</el-text>
      <el-text size="small" type="info">每格尺寸187 * 187</el-text>
      <magic-cube-editor v-model="formData.list" class="m-y-16px" :cols="4" :rows="4" @hot-area-selected="handleHotAreaSelected" />
      <template v-for="(hotArea, index) in formData.list" :key="index">
        <template v-if="selectedHotAreaIndex === index">
          <el-form-item label="上传图片" :prop="`list[${index}].imgUrl`">
            <upload-img v-model="hotArea.imgUrl" height="80px" width="80px" />
          </el-form-item>
          <el-form-item label="链接" :prop="`list[${index}].url`">
            <app-link-input v-model="hotArea.url" />
          </el-form-item>
        </template>
      </template>
      <el-form-item label="上圆角" prop="borderRadiusTop">
        <el-slider v-model="formData.borderRadiusTop" input-size="small" :max="100" :min="0" show-input :show-input-controls="false" />
      </el-form-item>
      <el-form-item label="下圆角" prop="borderRadiusBottom">
        <el-slider v-model="formData.borderRadiusBottom" input-size="small" :max="100" :min="0" show-input :show-input-controls="false" />
      </el-form-item>
      <el-form-item label="间隔" prop="space">
        <el-slider v-model="formData.space" input-size="small" :max="100" :min="0" show-input :show-input-controls="false" />
      </el-form-item>
    </el-form>
  </component-container-property>
</template>

<script setup lang="ts">
import { MagicCubeProperty } from '/@/components/DiyEditor/components/mobile/MagicCube/config'
import { usePropertyForm } from '/@/components/DiyEditor/util'

/** 广告魔方属性面板 */
defineOptions({ name: 'MagicCubeProperty' })

const props = defineProps<{ modelValue: MagicCubeProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)

// 选中的热区
const selectedHotAreaIndex = ref(-1)
const handleHotAreaSelected = (_: any, index: number) => {
  selectedHotAreaIndex.value = index
}
</script>

<style scoped lang="scss"></style>
