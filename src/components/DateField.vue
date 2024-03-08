<template>
  <div class="relative flex flex-col gap-0.5 lg:gap-2 text-gray-900">
    <label :for="label">{{ label }}</label>
    <VueDatePicker :id="label" v-model="model"></VueDatePicker>
  </div>
</template>

<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

defineProps<{ label: string }>();

const model = defineModel();
</script>
