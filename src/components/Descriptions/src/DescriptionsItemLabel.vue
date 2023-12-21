<script setup lang="ts">
const { label } = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <div class="cell-item">
    <icon v-if="icon" :icon="icon" :size="18" style="vertical-align: middle" />
    {{ label }}
  </div>
</template>

<style scoped lang="scss">
.cell-item {
  display: inline;
}

.cell-item::after {
  content: ':';
}
</style>
