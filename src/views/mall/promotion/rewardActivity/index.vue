<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入活动名称" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择活动状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PROMOTION_ACTIVITY_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          class="!w-240px"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          end-placeholder="活动结束日期"
          start-placeholder="活动开始日期"
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
        <el-button v-hasPermi="['product:brand:create']" plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" default-expand-all row-key="id">
      <el-table-column label="活动名称" prop="name" />
      <el-table-column align="center" :formatter="dateFormatter" label="活动开始时间" prop="sort[0]" />
      <el-table-column align="center" :formatter="dateFormatter" label="活动结束时间" prop="sort[1]" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PROMOTION_ACTIVITY_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['product:brand:update']" link type="primary" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button v-hasPermi="['product:brand:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <RewardForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import RewardForm from './RewardForm.vue'
import { DICT_TYPE, getIntDictOptions } from '/@/utils/dict'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'PromotionRewardActivity' })

const message = useMessage() // 消息弹窗
// const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  status: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const data = await ProductBrandApi.getBrandParam(queryParams)
    const data = {
      list: [
        {
          createTime: 1693463998000,
          description: '',
          id: 3,
          name: '索尼',
          picUrl: 'http://127.0.0.1:48080/admin-api/infra/file/4/get/f5b7a536306cd1180a42a2211a8212dc23de6b949d30c30d036caa063042f928.png',
          sort: [+new Date(), +new Date('2023-12-31')],
          status: 10,
        },
      ],
      total: 1,
    }
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  console.log(queryParams)
  message.success('已打印搜索参数')
  // return
  // getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  message.success('重置查询表单获取数据')
  // return
  // queryFormRef.value.resetFields()
  // handleQuery()
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
    message.success('您以确认删除')
    console.log(id)
    return
    // 发起删除
    // await ProductBrandApi.deleteBrand(id)
    // message.success(t('common.delSuccess'))
    // // 刷新列表
    // await getList()
  } catch (e) {
    console.log(e)
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
