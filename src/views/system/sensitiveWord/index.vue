<template>
  <!-- 搜索工作栏 -->
  <content-wrap>
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="敏感词" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入敏感词" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-select v-model="queryParams.tag" class="!w-240px" clearable placeholder="请选择标签" @keyup.enter="handleQuery">
          <el-option v-for="tag in tagList" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="请选择启用状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            class="!w-240px"
            :label="dict.label"
            :value="dict.value"
          />
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
          <icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button v-hasPermi="['system:sensitive-word:create']" plain type="primary" @click="openForm('create')">
          <icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['system:sensitive-word:export']" :loading="exportLoading" plain type="success" @click="handleExport">
          <icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
        <el-button plain type="warning" @click="openTestForm">
          <icon class="mr-5px" icon="ep:document-checked" />
          测试
        </el-button>
      </el-form-item>
    </el-form>
  </content-wrap>

  <!-- 列表 -->
  <content-wrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="编号" prop="id" />
      <el-table-column align="center" label="敏感词" prop="name" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" prop="description" />
      <el-table-column align="center" label="标签" prop="tags">
        <template #default="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag" class="mr-5px" :disable-transitions="true">
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormatter" label="创建时间" prop="createTime" width="180" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['infra:config:update']" link type="primary" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button v-hasPermi="['infra:config:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total" @pagination="getList" />
  </content-wrap>

  <!-- 表单弹窗：添加/修改 -->
  <sensitive-word-form ref="formRef" @success="getList" />

  <!-- 表单弹窗：测试敏感词 -->
  <sensitive-word-test-form ref="testFormRef" />
</template>
<script lang="ts" setup>
import SensitiveWordForm from './SensitiveWordForm.vue'
import SensitiveWordTestForm from './SensitiveWordTestForm.vue'
import * as SensitiveWordApi from '/@/api/system/sensitiveWord'
import { DICT_TYPE, getIntDictOptions } from '/@/utils/dict'
import download from '/@/utils/download'
import { dateFormatter } from '/@/utils/formatTime'

defineOptions({ name: 'SystemSensitiveWord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  tag: undefined,
  status: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const tagList = ref([]) // 标签数组

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SensitiveWordApi.getSensitiveWordPage(queryParams)
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

/** 测试敏感词按钮操作 */
const testFormRef = ref()
const openTestForm = () => {
  testFormRef.value.open()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SensitiveWordApi.deleteSensitiveWord(id)
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
    const data = await SensitiveWordApi.exportSensitiveWord(queryParams)
    download.excel(data, '敏感词.xls')
  } catch (e) {
    console.log(e)
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 获得 Tag 标签列表
  tagList.value = await SensitiveWordApi.getSensitiveWordTagList()
})
</script>
