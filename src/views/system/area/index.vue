<template>
  <doc-alert title="地区 & IP" url="https://doc.iocoder.cn/area-and-ip/" />

  <!-- 操作栏 -->
  <content-wrap>
    <el-button plain type="primary" @click="openForm()">
      <icon class="mr-5px" icon="ep:plus" />
      IP 查询
    </el-button>
  </content-wrap>

  <!-- 列表 -->
  <content-wrap>
    <div style="width: 100%; height: 700px">
      <!-- AutoResizer 自动调节大小 -->
      <el-auto-resizer>
        <template #default="{ height, width }">
          <!-- Virtualized Table 虚拟化表格：高性能，解决表格在大数据量下的卡顿问题 -->
          <el-table-v2 :columns="columns" :data="list" expand-column-key="id" :height="height" :width="width" />
        </template>
      </el-auto-resizer>
    </div>
  </content-wrap>

  <!-- 表单弹窗：添加/修改 -->
  <area-form ref="formRef" />
</template>
<script setup lang="tsx">
import type { Column } from 'element-plus'
import AreaForm from './AreaForm.vue'
import * as AreaApi from '/@/api/system/area'

defineOptions({ name: 'SystemArea' })

// 表格的 column 字段
const columns: Column[] = [
  {
    dataKey: 'id', // 需要渲染当前列的数据字段。例如说：{id:9527, name:'Mike'}，则填 id
    title: '编号', // 显示在单元格表头的文本
    width: 400, // 当前列的宽度，必须设置
    fixed: true, // 是否固定列
    key: 'id', // 树形展开对应的 key
  },
  {
    dataKey: 'name',
    title: '地名',
    width: 200,
  },
]
// 表格的数据
const list = ref([])

/**
 * 获得数据列表
 */
const getList = async () => {
  list.value = await AreaApi.getAreaTree()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = () => {
  formRef.value.open()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
