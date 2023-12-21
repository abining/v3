<template>
  <el-aside class="editor-left" width="261px">
    <el-scrollbar>
      <el-collapse v-model="extendGroups">
        <el-collapse-item v-for="group in groups" :key="group.name" :name="group.name" :title="group.name">
          <draggable
            :animation="200"
            class="component-container"
            :clone="handleCloneComponent"
            :force-fallback="true"
            ghost-class="draggable-ghost"
            :group="{ name: 'component', pull: 'clone', put: false }"
            item-key="index"
            :list="group.components"
            :sort="false"
          >
            <template #item="{ element }">
              <div>
                <div class="drag-placement">组件放置区域</div>
                <div class="component">
                  <icon :icon="element.icon" :size="32" />
                  <span class="mt-4px text-12px">{{ element.name }}</span>
                </div>
              </div>
            </template>
          </draggable>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import draggable from 'vuedraggable'
import { componentConfigs } from '../components/mobile/index'
import { DiyComponent, DiyComponentLibrary } from '/@/components/DiyEditor/util'

/** 组件库 */
defineOptions({ name: 'ComponentLibrary' })

// 组件列表
const props = defineProps<{
  list: DiyComponentLibrary[]
}>()
const groups = reactive<any[]>([])
// 展开的折叠面板
const extendGroups = reactive<string[]>([])
watch(
  () => props.list,
  () => {
    // 清除旧数据
    extendGroups.length = 0
    groups.length = 0
    // 重新生成数据
    props.list.forEach((group) => {
      // 是否展开分组
      if (group.extended) {
        extendGroups.push(group.name)
      }
      // 查找组件
      const components = group.components.map((name) => componentConfigs[name] as DiyComponent<any>).filter((component) => component)
      if (components.length > 0) {
        groups.push({
          name: group.name,
          components,
        })
      }
    })
  },
  {
    immediate: true,
  }
)

// 克隆组件
const handleCloneComponent = (component: DiyComponent<any>) => {
  return cloneDeep(component)
}
</script>

<style scoped lang="scss">
.editor-left {
  z-index: 1;
  flex-shrink: 0;
  box-shadow: 8px 0 8px -8px rgb(0 0 0 / 12%);

  :deep(.el-collapse) {
    border-top: none;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;
  }

  :deep(.el-collapse-item__header) {
    height: 32px;
    padding: 0 24px;
    line-height: 32px;
    background-color: var(--el-bg-color-page);
    border-bottom: none;
  }

  .component-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .component {
    display: flex;
    width: 86px;
    height: 86px;
    cursor: move;
    border-right: 1px solid var(--el-border-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .el-icon {
      margin-bottom: 4px;
      color: gray;
    }
  }

  .component.active,
  .component:hover {
    color: var(--el-color-white);
    background: var(--el-color-primary);

    .el-icon {
      color: var(--el-color-white);
    }
  }

  .component:nth-of-type(3n) {
    border-right: none;
  }
}

/* 拖拽占位提示，默认不显示 */
.drag-placement {
  display: none;
  color: #fff;
}

.drag-area {
  /* 拖拽到手机区域时的样式 */
  .draggable-ghost {
    display: flex;
    width: 100%;
    height: 40px;

    /* 条纹背景 */
    background: linear-gradient(45deg, #91a8d5 0, #91a8d5 10%, #94b4eb 10%, #94b4eb 50%, #91a8d5 50%, #91a8d5 60%, #94b4eb 60%, #94b4eb);
    background-size: 1rem 1rem;
    transition: all 0.5s;
    justify-content: center;
    align-items: center;

    span {
      display: inline-block;
      width: 140px;
      height: 25px;
      font-size: 12px;
      line-height: 25px;
      color: #fff;
      text-align: center;
      background: #5487df;
    }

    /* 拖拽时隐藏组件 */
    .component {
      display: none;
    }

    /* 拖拽时显示占位提示 */
    .drag-placement {
      display: block;
    }
  }
}
</style>
