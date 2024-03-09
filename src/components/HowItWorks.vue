<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { HolidayConfig } from "@/domain/config";

defineProps<{
  config: HolidayConfig;
}>();

const { t } = useI18n({
  messages: {
    en: {
      estimateHours: "Number of times granted per year :",
      minimumDays: "Minimum days granted :",
      maximumDays: "Maximum days granted :",
      times: "{time} time(s)",
      days: "{day} day(s)",
    },
    fr: {
      estimateHours: "Nombre de fois accordé par an :",
      minimumDays: "Nombre de jours au minimum autorisé :",
      maximumDays: "Nombre de jours au maximum autorisé :",
      times: "{time} fois",
      days: "{day} jour(s)",
    },
  },
});
</script>

<template>
  <div
    class="bg-blue-50 p-2 rounded-md flex flex-wrap gap-y-1.5 gap-x-3 break-after-all text-xs"
  >
    <div class="flex gap-0.5 items-center">
      <span class="text-gray-950">{{ t("estimateHours") }}</span>
      <span class="text-blue-800 font-bold">
        {{ t("times", { time: config.numberOfTime }) }}
      </span>
    </div>
    <div class="flex gap-0.5 items-center">
      <span class="text-gray-950">{{ t("minimumDays") }}</span>
      <span class="text-blue-800 font-bold">
        {{ t("days", { day: config.minimumOfDays }) }}
      </span>
    </div>
    <div class="flex gap-0.5 items-center">
      <span class="text-gray-950">{{ t("maximumDays") }}</span>
      <span class="text-blue-800 font-bold">
        {{ t("days", { day: config.maximumOfDays }) }}
      </span>
    </div>
  </div>
</template>
