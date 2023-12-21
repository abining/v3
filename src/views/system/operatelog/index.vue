<template>
  <doc-alert title="系统日志" url="https://doc.iocoder.cn/system-log/" />

  <content-wrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="系统模块" prop="module">
        <el-input v-model="queryParams.module" class="!w-240px" clearable placeholder="请输入系统模块" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="操作人员" prop="userNickname">
        <el-input v-model="queryParams.userNickname" class="!w-240px" clearable placeholder="请输入操作人员" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="操作类型" prop="type">
        <el-select v-model="queryParams.type" class="!w-240px" clearable placeholder="请选择操作类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_OPERATE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作状态" prop="success">
        <el-select v-model="queryParams.success" class="!w-240px" clearable placeholder="请选择操作状态">
          <el-option key="true" label="成功" :value="true" />
          <el-option key="false" label="失败" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          class="!w-240px"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button v-hasPermi="['infra:config:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </content-wrap>

  <!-- 列表 -->
  <content-wrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="日志编号" prop="id" />
      <el-table-column align="center" label="操作模块" prop="module" width="180" />
      <el-table-column align="center" label="操作名" prop="name" width="180" />
      <el-table-column align="center" label="操作类型" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_OPERATE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" prop="userNickname" />
      <el-table-column align="center" label="操作结果" prop="status">
        <template #default="scope">
          <span>{{ scope.row.resultCode === 0 ? '成功' : '失败' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormatter" label="操作时间" prop="startTime" width="180" />
      <el-table-column align="center" label="执行时长" prop="startTime">
        <template #default="scope">
          <span>{{ scope.row.duration }} ms</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['infra:config:query']" link type="primary" @click="openDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </content-wrap>

  <!-- 表单弹窗：详情 -->
  <operate-log-detail ref="detailRef" />
</template>
<script lang="ts" setup>
import OperateLogDetail from './OperateLogDetail.vue'
import * as OperateLogApi from '/@/api/system/operatelog'
import { DICT_TYPE, getIntDictOptions } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'SystemOperateLog' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  module: undefined,
  userNickname: undefined,
  type: undefined,
  success: undefined,
  startTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OperateLogApi.getOperateLogPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 详情操作 */
const detailRef = ref()
const openDetail = (data: OperateLogApi.OperateLogVO) => {
  detailRef.value.open(data)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await OperateLogApi.exportOperateLog(queryParams)
    download.excel(data, '操作日志.xls')
  } catch (e) {
    console.log(e)
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
