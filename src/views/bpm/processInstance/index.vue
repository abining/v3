<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入流程名称" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="所属流程" prop="processDefinitionId">
        <el-input
          v-model="queryParams.processDefinitionId"
          class="!w-240px"
          clearable
          placeholder="请输入流程定义的编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-select v-model="queryParams.category" class="!w-240px" clearable placeholder="请选择流程分类">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.BPM_MODEL_CATEGORY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结果" prop="result">
        <el-select v-model="queryParams.result" class="!w-240px" clearable placeholder="请选择结果">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间" prop="createTime">
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
        <el-button v-hasPermi="['bpm:process-instance:query']" plain type="primary" @click="handleCreate">
          <Icon class="mr-5px" icon="ep:plus" />
          发起流程
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="流程编号" prop="id" width="300px" />
      <el-table-column align="center" label="流程名称" prop="name" />
      <el-table-column align="center" label="流程分类" prop="category">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_MODEL_CATEGORY" :value="scope.row.category" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="当前审批任务" prop="tasks">
        <template #default="scope">
          <el-button v-for="task in scope.row.tasks" :key="task.id" link type="primary">
            <span>{{ task.name }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="结果" prop="result">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_PROCESS_INSTANCE_RESULT" :value="scope.row.result" />
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormatter" label="提交时间" prop="createTime" width="180" />
      <el-table-column align="center" :formatter="dateFormatter" label="结束时间" prop="endTime" width="180" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['bpm:process-instance:cancel']" link type="primary" @click="handleDetail(scope.row)">详情</el-button>
          <el-button
            v-if="scope.row.result === 1"
            v-hasPermi="['bpm:process-instance:query']"
            link
            type="primary"
            @click="handleCancel(scope.row)"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '/@/utils/dict'
import { dateFormatter } from '/@/utils/formatTime'
import { ElMessageBox } from 'element-plus'
import * as ProcessInstanceApi from '/@/api/bpm/processInstance'

defineOptions({ name: 'BpmProcessInstance' })

const router = useRouter() // 路由
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  processDefinitionId: undefined,
  category: undefined,
  status: undefined,
  result: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProcessInstanceApi.getMyProcessInstancePage(queryParams)
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

/** 发起流程操作 **/
const handleCreate = () => {
  router.push({
    name: 'BpmProcessInstanceCreate',
  })
}

/** 查看详情 */
const handleDetail = (row) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.id,
    },
  })
}

/** 取消按钮操作 */
const handleCancel = async (row) => {
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空',
  })
  // 发起取消
  await ProcessInstanceApi.cancelProcessInstance(row.id, value)
  message.success('取消成功')
  // 刷新列表
  await getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
