<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>

<template>
  <div class="flex gap-4 items-center">
    <span class="font-thin text-sm">{{ label }}:</span>
    <span class="text-base font-light text-gray-900">{{ value }}</span>
  </div>
</template>
