<template>
  <doc-alert title="支付功能开启" url="https://doc.iocoder.cn/pay/build/" />
  <!-- 搜索 -->
  <ContentWrap>
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="应用名" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入应用名" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="开启状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择开启状态">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
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
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button v-hasPermi="['pay:app:create']" plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="应用编号" prop="id" />
      <el-table-column align="center" label="应用名" prop="name" />
      <el-table-column align="center" label="开启状态" prop="status">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" @change="handleStatusChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付宝配置">
        <el-table-column align="center" :label="PayChannelEnum.ALIPAY_APP.name">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.ALIPAY_APP.code)"
              circle
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_APP.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button v-else circle type="danger" @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_APP.code)">
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="PayChannelEnum.ALIPAY_PC.name">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.ALIPAY_PC.code)"
              circle
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_PC.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button v-else circle type="danger" @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_PC.code)">
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="PayChannelEnum.ALIPAY_WAP.name">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.ALIPAY_WAP.code)"
              circle
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_WAP.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button v-else circle type="danger" @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_WAP.code)">
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="PayChannelEnum.ALIPAY_QR.name">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.ALIPAY_QR.code)"
              circle
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_QR.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button v-else circle type="danger" @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_QR.code)">
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="PayChannelEnum.ALIPAY_BAR.name">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.ALIPAY_BAR.code)"
              circle
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_BAR.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button v-else circle type="danger" @click="openChannelForm(scope.row, PayChannelEnum.ALIPAY_BAR.code)">
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="微信配置">
        <el-table-column align="center" :label="PayChannelEnum.WX_LITE.name">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.WX_LITE.code)"
              circle
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.WX_LITE.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button v-else circle type="danger" @click="openChannelForm(scope.row, PayChannelEnum.WX_LITE.code)">
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="PayChannelEnum.WX_PUB.name">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.WX_PUB.code)"
              circle
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.WX_PUB.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button v-else circle type="danger" @click="openChannelForm(scope.row, PayChannelEnum.WX_PUB.code)">
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="PayChannelEnum.WX_APP.name">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.WX_APP.code)"
              circle
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.WX_APP.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button v-else circle type="danger" @click="openChannelForm(scope.row, PayChannelEnum.WX_APP.code)">
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="模拟支付配置">
        <el-table-column align="center" :label="PayChannelEnum.MOCK.name">
          <template #default="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, PayChannelEnum.MOCK.code)"
              circle
              type="success"
              @click="openChannelForm(scope.row, PayChannelEnum.MOCK.code)"
            >
              <Icon icon="ep:check" />
            </el-button>
            <el-button v-else circle type="danger" @click="openChannelForm(scope.row, PayChannelEnum.MOCK.code)">
              <Icon icon="ep:close" />
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" min-width="110">
        <template #default="scope">
          <el-button v-hasPermi="['pay:app:update']" link type="primary" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button v-hasPermi="['pay:app:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <AppForm ref="formRef" @success="getList" />
  <AlipayChannelForm ref="alipayFormRef" @success="getList" />
  <WeixinChannelForm ref="weixinFormRef" @success="getList" />
  <MockChannelForm ref="mockFormRef" @success="getList" />
</template>
<script lang="ts" setup>
import AppForm from './components/AppForm.vue'
import AlipayChannelForm from './components/channel/AlipayChannelForm.vue'
import MockChannelForm from './components/channel/MockChannelForm.vue'
import WeixinChannelForm from './components/channel/WeixinChannelForm.vue'
import * as AppApi from '/@/api/pay/app'
import { CommonStatusEnum, PayChannelEnum } from '/@/utils/constants'
import { DICT_TYPE, getIntDictOptions } from '/@/utils/dict'

defineOptions({ name: 'PayApp' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  status: undefined,
  remark: undefined,
  payNotifyUrl: undefined,
  refundNotifyUrl: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AppApi.getAppPage(queryParams)
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

/** 应用状态修改 */
const handleStatusChange = async (row: any) => {
  const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
  try {
    await message.confirm(`确认要"${text}""${row.name}"应用吗?`)
    await AppApi.changeAppStatus({ id: row.id, status: row.status })
    message.success(`${text}成功`)
  } catch {
    row.status = row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
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
    await AppApi.deleteApp(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch (e) {
    console.log(e)
  }
}

/**
 * 根据渠道编码判断渠道列表中是否存在
 *
 * @param channels 渠道列表
 * @param channelCode 渠道编码
 */
const isChannelExists = (channels, channelCode) => {
  if (!channels) {
    return false
  }
  return channels.indexOf(channelCode) !== -1
}

/**
 * 新增支付渠道信息
 */
const alipayFormRef = ref()
const weixinFormRef = ref()
const mockFormRef = ref()
const channelParam = reactive({
  appId: null, // 应用 ID
  payCode: null, // 渠道编码
})
const openChannelForm = async (row, payCode) => {
  channelParam.appId = row.id
  channelParam.payCode = payCode
  if (payCode.indexOf('alipay_') === 0) {
    alipayFormRef.value.open(row.id, payCode)
    return
  }
  if (payCode.indexOf('wx_') === 0) {
    weixinFormRef.value.open(row.id, payCode)
    return
  }
  if (payCode.indexOf('mock') === 0) {
    mockFormRef.value.open(row.id, payCode)
  }
}

/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
