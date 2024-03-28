<template>
  <div class="relative flex flex-col gap-0.5 lg:gap-2 text-gray-900">
    <label :for="label">{{ label }}</label>
    <VueDatePicker
      :format="format"
      :id="label"
      auto-apply
      text-input
      v-model="model"
      :hide-input-icon="true"
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

const model = defineModel<string | Date>();
</script>

<style scoped>
.dp__theme_light {
  --dp-border-color: transparent;
  --dp-border-color-hover: transparent;
  --dp-font-size: 14px;
  --dp-input-padding: 9.5px 8px;
  --dp-border-radius: 18px;

  @apply rounded lg:rounded-lg outline-none border border-gray-300 hover:border-2 hover:border-blue-400;
}
</style>
