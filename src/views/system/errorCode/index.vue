<template>
  <doc-alert title="异常处理（错误码）" url="https://doc.iocoder.cn/exception/" />

  <!-- 搜索工作栏 -->
  <content-wrap>
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="90px" :model="queryParams">
      <el-form-item label="错误码类型" prop="type">
        <el-select v-model="queryParams.type" clearable placeholder="请选择错误码类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_ERROR_CODE_TYPE)"
            :key="dict.value"
            class="!w-240px"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="应用名" prop="applicationName">
        <el-input v-model="queryParams.applicationName" class="!w-240px" clearable placeholder="请输入应用名" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="错误码编码" prop="code">
        <el-input v-model="queryParams.code" class="!w-240px" clearable placeholder="请输入错误码编码" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="错误码提示" prop="message">
        <el-input v-model="queryParams.message" class="!w-240px" clearable placeholder="请输入错误码提示" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
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
        <el-button v-hasPermi="['system:error-code:create']" plain type="primary" @click="openForm('create')">
          <icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['system:error-code:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </content-wrap>

  <!-- 列表 -->
  <content-wrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="编号" prop="id" />
      <el-table-column align="center" label="类型" prop="type" width="80">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_ERROR_CODE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="应用名" prop="applicationName" width="200" />
      <el-table-column align="center" label="错误码编码" prop="code" width="120" />
      <el-table-column align="center" label="错误码提示" prop="message" width="300" />
      <el-table-column align="center" label="备注" prop="memo" width="200" />
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180" />
      <el-table-column align="center" class-name="small-paddingfixed-width" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['system:error-code:update']" link type="primary" @click="openForm('update', scope.row.id)">
            编辑
          </el-button>
          <el-button v-hasPermi="['system:error-code:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </content-wrap>

  <!-- 表单弹窗：添加/修改 -->
  <error-code-form ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import ErrorCodeForm from './ErrorCodeForm.vue'
import * as ErrorCodeApi from '/@/api/system/errorCode'
import { DICT_TYPE, getIntDictOptions } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'SystemErrorCode' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 遮罩层
const exportLoading = ref(false) // 导出遮罩层
const total = ref(0) // 总条数
const list = ref([]) // 错误码列表
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: undefined,
  applicationName: undefined,
  code: undefined,
  message: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ErrorCodeApi.getErrorCodePage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await ErrorCodeApi.deleteErrorCode(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch (e) {
    console.log(e)
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ErrorCodeApi.excelErrorCode(queryParams)
    download.excel(data, '错误码.xls')
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
