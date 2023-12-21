<template>
  <doc-alert title="短信配置" url="https://doc.iocoder.cn/sms/" />

  <content-wrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="150px" :model="queryParams">
      <el-form-item label="短信类型" prop="type">
        <el-select v-model="queryParams.type" class="!w-240px" clearable placeholder="请选择短信类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开启状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择开启状态">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="模板编码" prop="code">
        <el-input v-model="queryParams.code" class="!w-240px" clearable placeholder="请输入模板编码" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="短信 API 的模板编号" prop="apiTemplateId">
        <el-input
          v-model="queryParams.apiTemplateId"
          class="!w-240px"
          clearable
          placeholder="请输入短信 API 的模板编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="短信渠道" prop="channelId">
        <el-select v-model="queryParams.channelId" class="!w-240px" clearable placeholder="请选择短信渠道">
          <el-option
            v-for="channel in channelList"
            :key="channel.id"
            :label="channel.signature + `【 ${getDictLabel(DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE, channel.code)}】`"
            :value="channel.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          style="width: 240px"
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
        <el-button v-hasPermi="['system:sms-template:create']" plain type="primary" @click="openForm('create')">
          <icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['system:sms-template:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </content-wrap>

  <!-- 列表 -->
  <content-wrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="模板编码" prop="code" :show-overflow-tooltip="true" width="120" />
      <el-table-column align="center" label="模板名称" prop="name" :show-overflow-tooltip="true" width="120" />
      <el-table-column align="center" label="模板内容" prop="content" :show-overflow-tooltip="true" width="200" />
      <el-table-column align="center" label="短信类型" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="80">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column align="center" label="短信 API 的模板编号" prop="apiTemplateId" :show-overflow-tooltip="true" width="200" />
      <el-table-column align="center" label="短信渠道" width="120">
        <template #default="scope">
          <div>
            {{ channelList.find((channel) => channel.id === scope.row.channelId)?.signature }}
          </div>
          <dict-tag :type="DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE" :value="scope.row.channelCode" />
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180" />
      <el-table-column align="center" fixed="right" label="操作" width="210">
        <template #default="scope">
          <el-button v-hasPermi="['system:sms-template:update']" link type="primary" @click="openForm('update', scope.row.id)">
            修改
          </el-button>
          <el-button v-hasPermi="['system:sms-template:send-sms']" link type="primary" @click="openSendForm(scope.row.id)">测试</el-button>
          <el-button v-hasPermi="['system:sms-template:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </content-wrap>

  <!-- 表单弹窗：添加/修改 -->
  <sms-template-form ref="formRef" @success="getList" />
  <!-- 表单弹窗：测试发送 -->
  <sms-template-send-form ref="sendFormRef" />
</template>
<script lang="ts" setup>
import SmsTemplateForm from './SmsTemplateForm.vue'
import SmsTemplateSendForm from './SmsTemplateSendForm.vue'
import * as SmsChannelApi from '/@/api/system/sms/smsChannel'
import * as SmsTemplateApi from '/@/api/system/sms/smsTemplate'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'SystemSmsTemplate' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: undefined,
  status: undefined,
  code: '',
  content: '',
  apiTemplateId: '',
  channelId: undefined,
  createTime: [],
})
const exportLoading = ref(false) // 导出的加载中
const channelList = ref<SmsChannelApi.SmsChannelVO[]>([]) // 短信渠道列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SmsTemplateApi.getSmsTemplatePage(queryParams)
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

/** 发送短信按钮 */
const sendFormRef = ref()
const openSendForm = (id: number) => {
  sendFormRef.value.open(id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SmsTemplateApi.deleteSmsTemplate(id)
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
    const data = await SmsTemplateApi.exportSmsTemplate(queryParams)
    download.excel(data, '短信模板.xls')
  } catch (e) {
    console.log(e)
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 加载渠道列表
  channelList.value = await SmsChannelApi.getSimpleSmsChannelList()
})
</script>
