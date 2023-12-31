<template>
   <doc-alert title="功能权限" url="https://doc.iocoder.cn/resource-permission" />
  <doc-alert title="菜单路由" url="https://doc.iocoder.cn/vue3/route/" />

  <!-- 搜索工作栏 -->
  <content-wrap>
    <el-form ref="queryFormRef" class="-mb-15px" :inline="true" label-width="68px" :model="queryParams">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入菜单名称" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择菜单状态">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
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
        <el-button v-hasPermi="['system:menu:create']" plain type="primary" @click="openForm('create')">
          <icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button plain type="danger" @click="toggleExpandAll">
          <icon class="mr-5px" icon="ep:sort" />
          展开/折叠
        </el-button>
        <el-button plain @click="refreshMenu">
          <icon class="mr-5px" icon="ep:refresh" />
          刷新菜单缓存
        </el-button>
      </el-form-item>
    </el-form>
  </content-wrap>

  <!-- 列表 -->
  
    <el-table v-if="refreshTable" v-loading="loading" :data="list" :default-expand-all="isExpandAll" row-key="id">
      <el-table-column label="菜单名称" prop="name" :show-overflow-tooltip="true" width="250" />
      <el-table-column align="center" label="图标" prop="icon" width="100">
        <template #default="scope">
          <icon :icon="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" width="60" />
      <el-table-column label="权限标识" prop="permission" :show-overflow-tooltip="true" />
      <el-table-column label="组件路径" prop="component" :show-overflow-tooltip="true" />
      <el-table-column label="组件名称" prop="componentName" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="status" width="80">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['system:menu:update']" link type="primary" @click="openForm('update', scope.row.id)">修改</el-button>
          <el-button v-hasPermi="['system:menu:create']" link type="primary" @click="openForm('create', undefined, scope.row.id)">
            新增
          </el-button>
          <el-button v-hasPermi="['system:menu:delete']" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
 

  <!-- 表单弹窗：添加/修改 -->
  <menu-form ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import MenuForm from './MenuForm.vue'
import * as MenuApi from '/@/api/system/menu'
import { CACHE_KEY, useCache } from '/@/hooks/web/useCache'
import { DICT_TYPE, getIntDictOptions } from '/@/utils/dict'
import { handleTree } from '/@/utils/tree'

defineOptions({ name: 'SystemMenu' })

const { wsCache } = useCache()
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数据
const queryParams = reactive({
  name: undefined,
  status: undefined,
})
const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MenuApi.getMenuList(queryParams)
    list.value = handleTree(data)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, parentId?: number) => {
  formRef.value.open(type, id, parentId)
}

/** 展开/折叠操作 */
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 刷新菜单缓存按钮操作 */
const refreshMenu = async () => {
  try {
    await message.confirm('即将更新缓存刷新浏览器！', '刷新菜单缓存')
    // 清空，从而触发刷新
    wsCache.delete(CACHE_KEY.USER)
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
    // 刷新浏览器
    location.reload()
  } catch (e) {
    console.log(e)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MenuApi.deleteMenu(id)
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
