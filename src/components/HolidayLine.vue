<template>
  <tr
    :class="[
      'grid py-3 items-center',
      hasAccess ? 'grid-cols-6' : 'grid-cols-5',
    ]"
  >
    <td class="flex flex-col gap-2">
      <span class="break-all font-bold">{{ holiday.owner?.fullName }}</span>
      <span class="break-all">{{ holiday.owner?.email }}</span>
    </td>
    <td v-if="hasAccess" class="text-blue-600 font-bold capitalize">
      {{ holiday.type?.name }}
    </td>
    <td>{{ holiday?.createdAt }}</td>
    <td
      class="flex items-center justify-between col-span-2 rounded-md border border-dashed border-gray-300/60 py-0.5 px-2"
    >
      <div class="flex flex-col gap-1">
        <span>{{ t("startOn") }}</span>
        <span>{{ getLocalDateTime(holiday.validity?.startDate) }}</span>
      </div>
      <div class="w-2 h-2 rounded-full border border-gray-800 shrink-0"></div>
      <div class="flex flex-col gap-1">
        <span>{{ t("endOn") }}</span>
        <span>{{ getLocalDateTime(holiday.validity?.endDate) }}</span>
      </div>
    </td>
    <td class="flex pl-5 gap-4 items-center">
      <HolidayStatus :status="holiday?.status" />
      <div
        v-if="hasAccess"
        :data-test="`holiday-${holiday?.id}`"
        @click="$emit('handleClick', +holiday?.id)"
        class="cursor-pointer border hover:border-gray-200 rounded min-w-2 px-2 py-[2.9px] flex justify-center items-center"
      >
        <MoreActionIcon />
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Holiday } from "@/domain/holiday";
import HolidayStatus from "@/components/HolidayStatus.vue";
import MoreActionIcon from "@/components/svg/MoreActionIcon.vue";
import { getLocalDateTime } from "../utils/clock";

defineProps<{
  holiday: Holiday;
  hasAccess: boolean;
}>();

defineEmits<{
  (e: "handleClick", id: number): void;
}>();

const { t } = useI18n({
  messages: {
    en: {
      startOn: "Start",
      endOn: "End",
    },
    fr: {
      startOn: "Debut",
      endOn: "Fin",
    },
  },
});
</script>
