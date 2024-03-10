<template>
  <div class="relative flex flex-col gap-0.5 lg:gap-2 text-gray-900">
    <label :for="label">{{ label }}</label>
    <VueDatePicker
      :input-class-name="twCustomClasses"
      :format="format"
      :id="label"
      auto-apply
      text-input
      v-model="model"
    ></VueDatePicker>
  </div>
</template>

<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { DATE_PICKER_FORMAT } from "@/utils/enum";

withDefaults(
  defineProps<{
    label: string;
    format?: string;
  }>(),
  {
    format: DATE_PICKER_FORMAT.DEFAULT,
  },
);

const model = defineModel();
const twCustomClasses =
  "!rounded lg:!rounded-lg !px-10 py-2 lg:!py-2.5 outline-none border !border-gray-300 hover:!border-2 hover:!border-blue-400 focus:!border-2 focus:!border-blue-400";
</script>
