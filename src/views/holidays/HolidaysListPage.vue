<template>
  <section class="p-4 space-y-7">
    <AddHoliday
      @refresh="getAllHolidays"
      @close="closeCreateHolidayForm"
      v-if="shouldOpenCreateHolidayForm"
    />
    <HolidayDetailsModal
      :holidayId="currentHolidayId"
      v-if="currentHolidayId"
      @close="closeHolidayDetailsModal"
    />
    <InLoading v-if="isLoading" />
    <section class="flex flex-col gap-4" v-else>
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <h2 class="flex flex-col font-sans font-medium">
            <span class="text-blue-800 text-xl">
              {{ t("holidays", { total: holidays.length }) }}
            </span>
            <span class="text-xs text-gray-800 font-bold">
              {{ t("description") }}
            </span>
          </h2>
          <TwButton
            v-if="!session.token.isSuperAdmin"
            :cta="t('add')"
            class="text-sm"
            :theme="THEME.BLUE"
            @click="shouldOpenCreateHolidayForm = true"
          />
        </div>
        <div class="border-b border-gray-100 flex items-2">
          <span
            v-if="!session.token.isSuperAdmin"
            :data-test="t('private')"
            @click="shouldDisplayAllCreated = false"
            :class="[
              'rounded-t min-w-16 text-sm text-center transition duration-500 ease-in px-4 py-2 font-bold cursor-pointer',
              shouldDisplayAllCreated
                ? 'text-gray-500'
                : 'text-blue-600 border-b-2 bg-blue-50 border-blue-600',
            ]"
          >
            {{ t("private") }}
          </span>
          <span
            :data-test="t('incoming')"
            @click="shouldDisplayAllCreated = true"
            :class="[
              'rounded-t min-w-16 text-sm text-center transition duration-500 ease-in px-4 py-2 font-bold cursor-pointer',
              shouldDisplayAllCreated || session.token.isSuperAdmin
                ? 'text-blue-600 border-b-2 bg-blue-50 border-blue-600'
                : 'text-gray-500',
            ]"
          >
            {{ t("incoming") }}
          </span>
        </div>
      </div>
      <table class="w-full text-xs">
        <thead>
          <tr
            :class="[
              'grid rounded px-2 py-1 bg-gray-200 text-gray-700',
              hasAccess ? 'grid-cols-6' : 'grid-cols-5',
            ]"
          >
            <th>{{ t("owner") }}</th>
            <th v-if="hasAccess">{{ t("type") }}</th>
            <th>{{ t("createdAt") }}</th>
            <th class="col-span-2">{{ t("period") }}</th>
            <th class="pl-6">{{ t("status") }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <HolidayLine
            v-for="holiday in holidays"
            :key="holiday?.id"
            :holiday="holiday"
            @handleClick="openHolidayDetailsModal"
            :hasAccess="hasAccess"
          />
        </tbody>
      </table>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Holiday } from "@/domain/holiday";
import { useHolidayStore } from "@/stores/holiday";
import { useSessionStore } from "@/stores/session";
import {
  computed,
  defineAsyncComponent,
  onBeforeMount,
  type Ref,
  ref,
  watch,
} from "vue";
import TwButton from "@/components/TwButton.vue";
import { THEME } from "@/utils/enum";

const InLoading = defineAsyncComponent(
  () => import("@/components/InLoading.vue"),
);
const HolidayLine = defineAsyncComponent(
  () => import("@/components/HolidayLine.vue"),
);
const HolidayDetailsModal = defineAsyncComponent(
  () => import("@/components/HolidayDetailsModal.vue"),
);

const AddHoliday = defineAsyncComponent(
  () => import("@/components/AddHoliday.vue"),
);

const session = useSessionStore();
const holidayStore = useHolidayStore();
const isLoading = ref<boolean>(false);

const list = ref<Holiday[]>([]) as Ref<Holiday[]>;
const holidays = computed<Holiday[]>(() => list.value);

const currentHolidayId = ref<number | undefined>(undefined);

const openHolidayDetailsModal = (holidayId: number): void => {
  currentHolidayId.value = holidayId;
};

const closeHolidayDetailsModal = async (): Promise<void> => {
  currentHolidayId.value = undefined;
  await getAllHolidays();
};

const shouldDisplayAllCreated = ref<boolean>(false);
const hasAccess = computed<boolean>(
  () => !shouldDisplayAllCreated.value || session.token.hasAccess,
);

const getAllHolidays = async (): Promise<void> => {
  shouldOpenCreateHolidayForm.value = false;
  isLoading.value = true;
  list.value =
    shouldDisplayAllCreated.value || session.token.isSuperAdmin
      ? await holidayStore.getAllHolidays()
      : await holidayStore.getMyHolidays();
  isLoading.value = false;
};

const shouldOpenCreateHolidayForm = ref<boolean>(false);
const closeCreateHolidayForm = (): void => {
  shouldOpenCreateHolidayForm.value = false;
};

onBeforeMount(async () => {
  await getAllHolidays();
});

watch(
  () => shouldDisplayAllCreated.value,
  async () => {
    await getAllHolidays();
  },
);

const { t } = useI18n({
  messages: {
    en: {
      add: "+ Add new request",
      type: "Type",
      owner: "Owner",
      status: "Status",
      period: "Duration",
      createdAt: "Sending date",
      holidays: "Holidays {total}",
      incoming: "In coming",
      private: "Private",
      description:
        "Here you will find all created holidays. | here you will all holidays you created.",
    },
    fr: {
      add: "+ Créer une demande",
      type: "Type",
      period: "Durée",
      status: "Status",
      owner: "Propriétaire",
      createdAt: "Date d'envoie",
      holidays: "Congés {total}",
      incoming: "Arrivant",
      private: "Privé",
      description:
        "Ici vous trouverez tous les demandes de congés crées. | ici vous verrez toutes les demandes de congés que vous avez créés.",
    },
  },
});
</script>

<style scoped>
th {
  @apply text-left;
}
</style>
