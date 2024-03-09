<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { onBeforeMount, ref } from "vue";
import { useHolidayConfigStore } from "@/stores/config";
import { type HolidayConfig, NullableHolidayConfig } from "@/domain/config";

import TwButton from "@/components/TwButton.vue";
import { THEME } from "@/utils/enum";
import ConfigStatus from "@/components/ConfigStatus.vue";
import TwBreadcrumb from "@/components/TwBreadcrumb.vue";
import type { Link } from "@/utils/type";

const configStore = useHolidayConfigStore();
const config = ref<HolidayConfig>(NullableHolidayConfig());

const props = defineProps<{
  configId: string;
  holidayTypeId: string;
}>();

const { t } = useI18n({
  messages: {
    en: {
      apply: "Apply",
      close: "Close",
      draft: "Draft",
      status: "Status",
      configs: "Configuration",
      description: "Description",
      estimateHours: "Number of times granted per year :",
      minimumDays: "Minimum days granted :",
      maximumDays: "Maximum days granted :",
      times: "{time} time(s)",
      days: "{day} day(s)",
    },
    fr: {
      apply: "Applique",
      close: "Fermer",
      draft: "Brouillon",
      status: "Status",
      configs: "Configuration",
      description: "Description",
      estimateHours: "Nombre de fois accordé par an :",
      minimumDays: "Nombre de jours au minimum autorisé :",
      maximumDays: "Nombre de jours au maximum autorisé :",
      times: "{time} fois",
      days: "{day} jour(s)",
    },
  },
});

const isDetailsLoading = ref<boolean>(false);
const isAppliedLoading = ref<boolean>(false);
const isClosedLoading = ref<boolean>(false);

const closeConfig = async (): Promise<void> => {
  isClosedLoading.value = true;
  await configStore.deactivateConfig(+props.configId);
  isClosedLoading.value = false;
  await fetchDetails();
};

const applyConfig = async (): Promise<void> => {
  isAppliedLoading.value = true;
  await configStore.activeConfig(+props.configId);
  isAppliedLoading.value = false;
  await fetchDetails();
};

const fetchDetails = async (): Promise<void> => {
  isDetailsLoading.value = true;
  config.value = await configStore.getConfigById(+props.configId);
  isDetailsLoading.value = false;
};

const breadcrumb = ref<Link[]>([
  {
    name: "Holidays types",
    path: "/settings",
  },
  {
    name: `Holiday type ${props.holidayTypeId}`,
    path: `/settings/${props.holidayTypeId}`,
  },
  {
    name: `config ${props.configId}`,
    path: `/settings/${props.holidayTypeId}/${props.configId}`,
  },
]);

onBeforeMount(async () => {
  await fetchDetails();
});
</script>

<template>
  <section class="p-4 flex flex-col gap-4">
    <TwBreadcrumb :breadcrumb="breadcrumb" />
    <section class="bg-white rounded-lg p-7 flex flex-col gap-y-7">
      <section class="flex gap-3 items-center justify-end">
        <TwButton
          v-if="config.isActive"
          :cta="t('close')"
          :theme="THEME.RED"
          @click="closeConfig"
          :is-loading="isClosedLoading"
        />
        <TwButton
          v-else
          :cta="t('apply')"
          :theme="THEME.GREEN"
          @click="applyConfig"
          :is-loading="isAppliedLoading"
        />
      </section>
      <section class="grid grid-cols-2 gap-7">
        <div class="flex gap-4">
          <span class="text-gray-950 font-bold">{{ t("estimateHours") }}</span>
          <span>{{ t("times", { time: config.numberOfTime }) }}</span>
        </div>
        <div class="flex gap-4">
          <span class="text-gray-950 font-bold">{{ t("minimumDays") }}</span>
          <span>{{ t("days", { day: config.minimumOfDays }) }}</span>
        </div>
        <div class="flex gap-4">
          <span class="text-gray-950 font-bold">{{ t("maximumDays") }}</span>
          <span>{{ t("days", { day: config.maximumOfDays }) }}</span>
        </div>
        <div class="flex gap-4">
          <span class="text-gray-950 font-bold">{{ t("status") }}</span>
          <ConfigStatus :is-detail-mode="true" :status="config.status" />
        </div>
      </section>
    </section>
    <section class="bg-white rounded-lg p-7 flex flex-col gap-3">
      <h1 class="text-xl font-semibold">{{ t("description") }}</h1>
      <div class="text-gray-950">{{ config.description }}</div>
    </section>
  </section>
</template>
