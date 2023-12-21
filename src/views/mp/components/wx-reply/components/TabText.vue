<template>
  <el-input v-model="content" placeholder="请输入内容" :rows="5" type="textarea" />
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | null)
  (e: 'input', v: string | null)
}>()

const content = computed<string | null | undefined>({
  get: () => props.modelValue,
  set: (val: string | null) => {
    emit('update:modelValue', val)
    emit('input', val)
  },
})
</script>
