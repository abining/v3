<template>
  <Dialog v-model="dialogVisible" :max-height="500" :scroll="true" title="详情">
    <descriptions :data="detailData" :schema="allSchemas.detailSchema">
      <!-- 展示 HTML 内容 -->
      <template #templateContent="{ row }">
        <div v-dompurify-html="row.templateContent"></div>
      </template>
    </descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { allSchemas } from './log.data'
import * as MailLogApi from '/@/api/system/mail/log'

defineOptions({ name: 'SystemMailLogDetail' })

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中
const detailData = ref() // 详情数据

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  // 设置数据
  detailLoading.value = true
  try {
    detailData.value = await MailLogApi.getMailLog(id)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
