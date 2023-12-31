<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form ref="formRef" v-loading="formLoading" label-width="100px" :model="formData" :rules="formRules">
      <el-form-item label="线索名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入线索名称" />
      </el-form-item>
      <!-- TODO 芋艿：后续客户的选择 -->
      <el-form-item label="客户" prop="customerId">
        <el-select v-model="formData.customerId" clearable placeholder="请选择客户">
          <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="下次联系时间" prop="contactNextTime">
        <el-date-picker v-model="formData.contactNextTime" placeholder="选择下次联系时间" type="date" value-format="x" />
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="formData.telephone" placeholder="请输入电话" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="formData.address" placeholder="请输入地址" />
      </el-form-item>
      <!-- TODO wanwan 负责人选择 -->
      <el-form-item label="负责人" prop="ownerUserId">
        <el-input v-model="formData.ownerUserId" placeholder="请输入负责人" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as ClueApi from '/@/api/crm/clue'
import * as CustomerApi from '/@/api/crm/customer'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const customerList = ref([]) // 客户列表
const formData = ref({
  id: undefined,
  name: undefined,
  customerId: undefined,
  contactNextTime: undefined,
  telephone: undefined,
  mobile: undefined,
  address: undefined,
  ownerUserId: undefined,
  contactLastTime: undefined,
  remark: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '线索名称不能为空', trigger: 'blur' }],
  customerId: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t(`action.${type}`)
  formType.value = type
  resetForm()
  const customerData = await CustomerApi.getCustomerPage({
    pageNo: 1,
    pageSize: 100,
    pool: false,
  })
  customerList.value = customerData.list
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ClueApi.getClue(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ClueApi.ClueVO
    if (formType.value === 'create') {
      await ClueApi.createClue(data)
      message.success(t('common.createSuccess'))
    } else {
      await ClueApi.updateClue(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    customerId: undefined,
    contactNextTime: undefined,
    telephone: undefined,
    mobile: undefined,
    address: undefined,
    ownerUserId: undefined,
    contactLastTime: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
