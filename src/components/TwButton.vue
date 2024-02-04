<template>
  <button :class="['font-bold flex justify-center items-center rounded-lg', theme.toLowerCase()]">
    <slot name="content" :cta="cta">{{ cta }}</slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  cta: string;
  theme: string;
}>()
</script>

<style scoped>
.blue {
  @apply bg-blue-500 text-white px-2 py-4
}
</style>