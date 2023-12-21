<template>
  <doc-alert title="系统日志" url="https://doc.iocoder.cn/system-log/" />

  <content-wrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="queryParams.username" class="!w-240px" clearable placeholder="请输入用户名称" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="登录地址" prop="userIp">
        <el-input v-model="queryParams.userIp" class="!w-240px" clearable placeholder="请输入登录地址" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="登录日期" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
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
      <el-table-column align="center" label="操作类型" prop="logType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_LOGIN_TYPE" :value="scope.row.logType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名称" prop="username" width="180" />
      <el-table-column align="center" label="登录地址" prop="userIp" width="180" />
      <el-table-column align="center" label="浏览器" prop="userAgent" />
      <el-table-column align="center" label="登陆结果" prop="result">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_LOGIN_RESULT" :value="scope.row.result" />
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormatter" label="登录日期" prop="createTime" width="180" />
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
  <login-log-detail ref="detailRef" />
</template>
<script lang="ts" setup>
import LoginLogDetail from './LoginLogDetail.vue'
import * as LoginLogApi from '/@/api/system/loginLog'
import { DICT_TYPE } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'SystemLoginLog' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: undefined,
  userIp: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await LoginLogApi.getLoginLogPage(queryParams)
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
const openDetail = (data: LoginLogApi.LoginLogVO) => {
  detailRef.value.open(data)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await LoginLogApi.exportLoginLog(queryParams)
    download.excel(data, '登录日志.xls')
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
