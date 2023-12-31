<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="85px" :model="queryParams">
      <el-form-item label="推广员编号" prop="bindUserId">
        <el-input v-model="queryParams.bindUserId" class="!w-240px" clearable placeholder="请输入推广员编号" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="推广资格" prop="brokerageEnabled">
        <el-select v-model="queryParams.brokerageEnabled" class="!w-240px" clearable placeholder="请选择推广资格">
          <el-option label="有" :value="true" />
          <el-option label="无" :value="false" />
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
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="用户编号" min-width="80px" prop="id" />
      <el-table-column align="center" label="头像" prop="avatar" width="70px">
        <template #default="scope">
          <el-avatar :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" min-width="80px" prop="nickname" />
      <el-table-column align="center" label="推广人数" prop="brokerageUserCount" width="80px" />
      <el-table-column align="center" label="推广订单数量" min-width="110px" prop="brokerageOrderCount" />
      <el-table-column align="center" :formatter="fenToYuanFormat" label="推广订单金额" min-width="110px" prop="brokerageOrderPrice" />
      <el-table-column align="center" :formatter="fenToYuanFormat" label="已提现金额" min-width="100px" prop="withdrawPrice" />
      <el-table-column align="center" label="已提现次数" min-width="100px" prop="withdrawCount" />
      <el-table-column align="center" :formatter="fenToYuanFormat" label="未提现金额" min-width="100px" prop="price" />
      <el-table-column align="center" :formatter="fenToYuanFormat" label="冻结中佣金" min-width="100px" prop="frozenPrice" />
      <el-table-column align="center" label="推广资格" min-width="80px" prop="brokerageEnabled">
        <template #default="scope">
          <el-switch
            v-model="scope.row.brokerageEnabled"
            active-text="有"
            :disabled="!checkPermi(['trade:brokerage-user:update-bind-user'])"
            inactive-text="无"
            inline-prompt
            @change="handleBrokerageEnabledChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormatter" label="成为推广员时间" prop="brokerageTime" width="180px" />
      <el-table-column align="center" label="上级推广员编号" prop="bindUserId" width="150px" />
      <el-table-column align="center" :formatter="dateFormatter" label="推广员绑定时间" prop="bindUserTime" width="180px" />
      <el-table-column align="center" fixed="right" label="操作" width="150px">
        <template #default="scope">
          <el-dropdown
            v-hasPermi="[
              'trade:brokerage-user:user-query',
              'trade:brokerage-user:order-query',
              'trade:brokerage-user:update-bind-user',
              'trade:brokerage-user:clear-bind-user',
            ]"
            @command="(command) => handleCommand(command, scope.row)"
          >
            <el-button link type="primary">
              <Icon icon="ep:d-arrow-right" />
              更多
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="checkPermi(['trade:brokerage-user:user-query'])" command="openBrokerageUserTable">
                  推广人
                </el-dropdown-item>
                <el-dropdown-item v-if="checkPermi(['trade:brokerage-user:order-query'])" command="openBrokerageOrderTable">
                  推广订单
                </el-dropdown-item>
                <el-dropdown-item v-if="checkPermi(['trade:brokerage-user:update-bind-user'])" command="openUpdateBindUserForm">
                  修改上级推广人
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.bindUserId && checkPermi(['trade:brokerage-user:clear-bind-user'])"
                  command="handleClearBindUser"
                >
                  清除上级推广人
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>
  <!-- 修改上级推广人表单 -->
  <UpdateBindUserForm ref="updateBindUserFormRef" @success="getList" />
  <!-- 推广人列表 -->
  <BrokerageUserListDialog ref="brokerageUserListDialogRef" />
  <!-- 推广订单列表 -->
  <BrokerageOrderListDialog ref="brokerageOrderListDialogRef" />
</template>

<script setup lang="ts">
import * as BrokerageUserApi from '/@/api/mall/trade/brokerage/user'
import { dateFormatter } from '/@/utils/formatTime'
import { fenToYuanFormat } from '/@/utils/formatter'
import { checkPermi } from '/@/utils/permission'
import BrokerageOrderListDialog from '/@/views/mall/trade/brokerage/user/BrokerageOrderListDialog.vue'
import BrokerageUserListDialog from '/@/views/mall/trade/brokerage/user/BrokerageUserListDialog.vue'
import UpdateBindUserForm from '/@/views/mall/trade/brokerage/user/UpdateBindUserForm.vue'

defineOptions({ name: 'TradeBrokerageUser' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  bindUserId: null,
  brokerageEnabled: true,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BrokerageUserApi.getBrokerageUserPage(queryParams)
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

const handleCommand = (command: string, row: BrokerageUserApi.BrokerageUserVO) => {
  switch (command) {
    case 'openBrokerageUserTable':
      openBrokerageUserTable(row.id)
      break
    case 'openBrokerageOrderTable':
      openBrokerageOrderTable(row.id)
      break
    case 'openUpdateBindUserForm':
      openUpdateBindUserForm(row)
      break
    case 'handleClearBindUser':
      handleClearBindUser(row)
      break
  }
}

/** 打开推广人列表 */
const brokerageUserListDialogRef = ref()
const openBrokerageUserTable = (id: number) => {
  brokerageUserListDialogRef.value.open(id)
}

/** 打开推广订单列表 */
const brokerageOrderListDialogRef = ref()
const openBrokerageOrderTable = (id: number) => {
  brokerageOrderListDialogRef.value.open(id)
}

/** 打开表单：修改上级推广人 */
const updateBindUserFormRef = ref()
const openUpdateBindUserForm = (row: BrokerageUserApi.BrokerageUserVO) => {
  updateBindUserFormRef.value.open(row)
}

/** 清除上级推广人 */
const handleClearBindUser = async (row: BrokerageUserApi.BrokerageUserVO) => {
  try {
    // 二次确认
    await message.confirm(`确认要清除"${row.nickname}"的上级推广人吗？`)
    // 发起修改
    await BrokerageUserApi.clearBindUser({ id: row.id })
    message.success('清除成功')
    // 刷新列表
    await getList()
  } catch (e) {
    console.log(e)
  }
}

/** 推广资格：开通/关闭 */
const handleBrokerageEnabledChange = async (row: BrokerageUserApi.BrokerageUserVO) => {
  try {
    // 二次确认
    const text = row.brokerageEnabled ? '开通' : '关闭'
    await message.confirm(`确认要${text}"${row.nickname}"的推广资格吗？`)
    // 发起修改
    await BrokerageUserApi.updateBrokerageEnabled({ id: row.id, enabled: row.brokerageEnabled })
    message.success(`${text}成功`)
    // 刷新列表
    await getList()
  } catch {
    // 异常时，需要重置回之前的值
    row.brokerageEnabled = !row.brokerageEnabled
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
