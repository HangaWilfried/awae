<template>
  <button
    :data-test="cta"
    :disabled="disabled || isLoading"
    :class="[
      'font-bold outline-none flex justify-center items-center rounded-[4.75px] text-xs px-2 py-1.5 min-w-[60px]',
      theme.toLowerCase(),
      { 'cursor-pointer': !disabled || !isLoading },
    ]"
  >
    <span class="loader" v-if="isLoading"></span>
    <slot v-else name="content" :cta="cta">{{ cta }}</slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  cta: string;
  theme: string;
  disabled?: boolean;
  isLoading?: boolean;
}>();
</script>

<style scoped>
.blue {
  @apply bg-blue-500 text-white;
}

.border_blue {
  @apply border border-gray-300 text-black;
}

.gray {
  @apply bg-gray-200/80 text-gray-900/40;
}

.dark_gray {
  @apply bg-gray-900 text-white;
}

.red {
  @apply bg-red-500 text-white;
}

.green {
  @apply bg-green-600 text-white;
}

.light_blue {
  @apply bg-blue-400 text-white px-4 py-1;
}

.loader {
  @apply w-6 h-6 rounded-full border-2 border-gray-100 border-t-indigo-800 animate-spin;
}
</style>
