<template>
  <component-container-property v-model="formData.style">
    <el-text tag="p">菜单设置</el-text>
    <el-text size="small" type="info">拖动左侧的小圆点可以调整顺序</el-text>

    <!-- 表单 -->
    <el-form class="m-t-8px" label-width="60px" :model="formData">
      <div v-if="formData.list.length">
        <vue-draggable :animation="200" :force-fallback="true" handle=".drag-icon" item-key="index" :list="formData.list">
          <template #item="{ element, index }">
            <div class="mb-4px flex flex-col gap-4px rounded bg-gray-100 p-8px">
              <div class="flex flex-row justify-between">
                <icon class="drag-icon cursor-move" icon="ic:round-drag-indicator" />
                <icon class="text-red-500" icon="ep:delete" @click="handleDeleteMenu(index)" />
              </div>
              <el-form-item label="图标" prop="iconUrl">
                <upload-img v-model="element.iconUrl" height="80px" width="80px">
                  <template #tip>建议尺寸：44 * 44</template>
                </upload-img>
              </el-form-item>
              <el-form-item label="标题" prop="title">
                <input-with-color v-model="element.title" v-model:color="element.titleColor" />
              </el-form-item>
              <el-form-item label="副标题" prop="subtitle">
                <input-with-color v-model="element.subtitle" v-model:color="element.subtitleColor" />
              </el-form-item>
              <el-form-item label="链接" prop="url">
                <app-link-input v-model="element.url" />
              </el-form-item>
            </div>
          </template>
        </vue-draggable>
      </div>
      <el-form-item label-width="0">
        <el-button class="m-t-8px w-full" plain type="primary" @click="handleAddMenu">
          <icon class="mr-5px" icon="ep:plus" />
          添加菜单
        </el-button>
      </el-form-item>
    </el-form>
  </component-container-property>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import VueDraggable from 'vuedraggable'
import { EMPTY_MENU_LIST_ITEM_PROPERTY, MenuListProperty } from '/@/components/DiyEditor/components/mobile/MenuList/config'
import { usePropertyForm } from '/@/components/DiyEditor/util'

/** 列表导航属性面板 */
defineOptions({ name: 'MenuListProperty' })

const props = defineProps<{ modelValue: MenuListProperty }>()
const emit = defineEmits(['update:modelValue'])
const { formData } = usePropertyForm(props.modelValue, emit)

/* 添加菜单 */
const handleAddMenu = () => {
  formData.value.list.push(cloneDeep(EMPTY_MENU_LIST_ITEM_PROPERTY))
}
/* 删除菜单 */
const handleDeleteMenu = (index: number) => {
  formData.value.list.splice(index, 1)
}
</script>

<style scoped lang="scss"></style>
