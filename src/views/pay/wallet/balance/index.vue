<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="queryParams.nickname" class="!w-240px" clearable placeholder="请输入用户昵称" @keyup.enter="handleQuery" />
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
      <el-table-column align="center" label="编号" prop="id" />
      <el-table-column align="center" label="用户昵称" prop="nickname" />
      <el-table-column align="center" label="头像" prop="avatar" width="80px">
        <template #default="scope">
          <img :src="scope.row.avatar" style="width: 40px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户类型" prop="userType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.USER_TYPE" :value="scope.row.userType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="余额" prop="balance">
        <template #default="{ row }">{{ fenToYuan(row.balance) }} 元</template>
      </el-table-column>
      <el-table-column align="center" label="累计支出" prop="totalExpense">
        <template #default="{ row }">{{ fenToYuan(row.totalExpense) }} 元</template>
      </el-table-column>
      <el-table-column align="center" label="累计充值" prop="totalRecharge">
        <template #default="{ row }">{{ fenToYuan(row.totalRecharge) }} 元</template>
      </el-table-column>
      <el-table-column align="center" label="冻结金额" prop="freezePrice">
        <template #default="{ row }">{{ fenToYuan(row.freezePrice) }} 元</template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180px" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="openForm(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 弹窗 -->
  <WalletForm ref="formRef" />
</template>

<script setup lang="ts">
import WalletForm from './WalletForm.vue'
import * as WalletApi from '/@/api/pay/wallet/balance/index'
import { fenToYuan } from '/@/utils'
import { DICT_TYPE } from '/@/utils/dict'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'WalletBalance' })

// const message = useMessage() // 消息弹

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nickname: null,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
// const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WalletApi.getWalletPage(queryParams)
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
const openForm = (id?: number) => {
  formRef.value.open(id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
