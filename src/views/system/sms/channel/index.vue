<template>
  <doc-alert title="短信配置" url="https://doc.iocoder.cn/sms/" />

  <content-wrap>
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="短信签名" prop="signature">
        <el-input v-model="queryParams.signature" clearable placeholder="请输入短信签名" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="请选择启用状态">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
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
        <el-button v-hasPermi="['system:sms-channel:create']" plain type="primary" @click="openForm('create')">
          <icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </content-wrap>

  <!-- 列表 -->
  <content-wrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="编号" prop="id" />
      <el-table-column align="center" label="短信签名" prop="signature" />
      <el-table-column align="center" label="渠道编码" prop="code">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE" :value="scope.row.code" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="启用状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="短信 API 的账号" prop="apiKey" :show-overflow-tooltip="true" width="180" />
      <el-table-column align="center" label="短信 API 的密钥" prop="apiSecret" :show-overflow-tooltip="true" width="180" />
      <el-table-column align="center" label="短信发送回调 URL" prop="callbackUrl" :show-overflow-tooltip="true" width="180" />
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['system:sms-channel:update']" link type="primary" @click="openForm('update', scope.row.id)">
            编辑
          </el-button>
          <el-button v-hasPermi="['system:sms-channel:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </content-wrap>

  <!-- 表单弹窗：添加/修改 -->
  <sms-channel-form ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import SmsChannelForm from './SmsChannelForm.vue'
import * as SmsChannelApi from '/@/api/system/sms/smsChannel'
import { DICT_TYPE, getIntDictOptions } from '/@/utils/dict'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'SystemSmsChannel' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  signature: undefined,
  status: undefined,
  createTime: [],
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SmsChannelApi.getSmsChannelPage(queryParams)
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
    // 发起删除
    await SmsChannelApi.deleteSmsChannel(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch (e) {
    console.log(e)
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
