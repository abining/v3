<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { CSSProperties } from 'vue'
import { IconJson } from '/@/components/Icon/src/data'

defineOptions({ name: 'IconSelect' })

type ParameterCSSProperties = (item?: string) => CSSProperties | undefined

const props = defineProps({
  modelValue: {
    require: false,
    type: String,
  },
})
const emit = defineEmits<{ (e: 'update:modelValue', v: string) }>()

const visible = ref(false)
const inputValue = toRef(props, 'modelValue')
const iconList = ref(IconJson)
const icon = ref('add-location')
const currentActiveType = ref('ep:')
// 深拷贝图标数据，前端做搜索
const copyIconList = cloneDeep(iconList.value)

const pageSize = ref(96)
const currentPage = ref(1)

// 搜索条件
const filterValue = ref('')

const tabsList = [
  {
    label: 'Element Plus',
    name: 'ep:',
  },
  {
    label: 'Font Awesome 4',
    name: 'fa:',
  },
  {
    label: 'Font Awesome 5 Solid',
    name: 'fa-solid:',
  },
]

const pageList = computed(() => {
  // 分页
  if (currentPage.value === 1) {
    return copyIconList[currentActiveType.value]?.filter((v) => v.includes(filterValue.value)).slice(currentPage.value - 1, pageSize.value)
  } else {
    return copyIconList[currentActiveType.value]
      ?.filter((v) => v.includes(filterValue.value))
      .slice(pageSize.value * (currentPage.value - 1), pageSize.value * (currentPage.value - 1) + pageSize.value)
  }
})
const iconCount = computed(() => {
  return copyIconList[currentActiveType.value] == undefined ? 0 : copyIconList[currentActiveType.value].length
})

const iconItemStyle = computed((): ParameterCSSProperties => {
  return (item) => {
    if (inputValue.value === currentActiveType.value + item) {
      return {
        borderColor: 'var(--el-color-primary)',
        color: 'var(--el-color-primary)',
      }
    }
  }
})

function handleClick({ props }) {
  currentPage.value = 1
  currentActiveType.value = props.name
  emit('update:modelValue', currentActiveType.value + iconList.value[currentActiveType.value][0])
  icon.value = iconList.value[currentActiveType.value][0]
}

function onChangeIcon(item) {
  icon.value = item
  emit('update:modelValue', currentActiveType.value + item)
  visible.value = false
}

function onCurrentChange(page) {
  currentPage.value = page
}

watch(
  () => {
    return props.modelValue
  },
  () => {
    if (props.modelValue && props.modelValue.indexOf(':') >= 0) {
      currentActiveType.value = props.modelValue.substring(0, props.modelValue.indexOf(':') + 1)
      icon.value = props.modelValue.substring(props.modelValue.indexOf(':') + 1)
    }
  }
)
watch(
  () => {
    return filterValue.value
  },
  () => {
    currentPage.value = 1
  }
)
</script>

<template>
  <div class="selector">
    <el-input v-model="inputValue" @click="visible = !visible">
      <template #append>
        <el-popover
          popper-class="pure-popper"
          :popper-options="{
            placement: 'auto',
          }"
          trigger="click"
          :visible="visible"
          :width="350"
        >
          <template #reference>
            <div class="h-32px w-40px flex cursor-pointer items-center justify-center" @click="visible = !visible">
              <icon :icon="currentActiveType + icon" />
            </div>
          </template>

          <el-input v-model="filterValue" class="p-2" clearable placeholder="搜索图标" />
          <el-divider border-style="dashed" />

          <el-tabs v-model="currentActiveType" @tab-click="handleClick">
            <el-tab-pane v-for="(pane, index) in tabsList" :key="index" :label="pane.label" :name="pane.name">
              <el-divider border-style="dashed" class="tab-divider" />
              <el-scrollbar height="220px">
                <!-- <el-button type="warn" @click="console.log(pageList)">
                  <vab-icon  icon="ep:cpu" />
                </el-button> -->
                <ul class="ml-2 flex flex-wrap px-2">
                  <li
                    v-for="(item, key) in pageList"
                    :key="key"
                    class="icon-item mr-2 mt-1 w-1/10 flex cursor-pointer items-center justify-center border border-solid p-2"
                    :style="iconItemStyle(item)"
                    :title="item"
                    @click="onChangeIcon(item)"
                  >
                    <!-- <icon  :icon="currentActiveType + item" /> -->
                    <!-- <a>{{ currentActiveType+item }}</a> -->
                    <Icon :icon="currentActiveType+item" />
                  </li>
                
                </ul>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
          <el-divider border-style="dashed" />

          <el-pagination
            background
            class="h-10 flex items-center justify-center"
            :current-page="currentPage"
            layout="prev, pager, next"
            :page-size="pageSize"
            small
            :total="iconCount"
            @current-change="onCurrentChange"
          />
        </el-popover>
      </template>
    </el-input>
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 1px auto !important;
}

.tab-divider.el-divider--horizontal {
  margin: 0 !important;
}

.icon-item {
  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    transform: scaleX(1.05);
    transition: all 0.4s;
  }
}

:deep(.el-tabs__nav-next) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: -5px 0 5px -6px #ccc;
}

:deep(.el-tabs__nav-prev) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: 5px 0 5px -6px #ccc;
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-tabs__item) {
  height: 30px;
  font-size: 12px;
  font-weight: normal;
  line-height: 30px;
}

:deep(.el-tabs__header),
:deep(.el-tabs__nav-wrap) {
  position: static;
  margin: 0;
}
</style>
