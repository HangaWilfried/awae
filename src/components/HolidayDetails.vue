<template>
  <section class="absolute rounded-md right-4 border w-1/2 h-[95vh] bg-white">
    <div
      class="flex items-center justify-between px-4 py-2.5 border-b border-gray-100"
    >
      <h2 class="font-semibold text-lg">{{ t("holidayDetails") }}</h2>
      <CloseButton @click="close" />
    </div>
    <div class="flex h-full items-center" v-if="isLoading">
      <InLoading />
    </div>
    <section class="divide-y divide-gray-200" v-else>
      <section class="py-6 px-4 flex justify-between items-center">
        <div class="flex gap-3">
          <span class="font-bold text-lg">{{ t("owner") }}</span>
          <div class="flex flex-col">
            <span>{{ holiday.owner.email }}</span>
            <span>{{ holiday.owner.fullName }}</span>
          </div>
        </div>
        <TwButton
          @click="$emit('edit')"
          :cta="t('edit')"
          v-if="holiday.isDraft"
          :theme="THEME.DARK_GRAY"
          class="!py-1.5 !px-4 !min-w-fit !text-sm"
        />
      </section>
      <section class="py-6 px-4 flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <span>{{ t("type") }}</span>
          <span>{{ holiday.type.name }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span>{{ t("title") }}</span>
          <span>{{ holiday.title }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span>{{ t("status") }}</span>
          <HolidayStatus :status="holiday.status" />
        </div>
        <div class="flex justify-between items-center">
          <span>{{ t("period") }}</span>
          <span>
            {{ holiday.validity.formatDate(t) }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span>{{ t("createdAt") }}</span>
          <span>{{ holiday.createdAt }}</span>
        </div>
      </section>
      <section class="py-10 px-4 space-y-1.5">
        <span class="text-xl font-medium">{{ t("description") }}</span>
        <p>{{ holiday.description }}</p>
      </section>
      <section
        class="!text-sm p-4 pt-10 flex gap-2 items-center relative"
        v-if="!holiday.isClose"
      >
        <ConfirmStatusChangesCard
          v-if="actionToInit"
          :is-busy="isStatusChangeLoading"
          :action="actionToInit"
          @try="(reason) => confirmChangeStatus(reason)"
          :canTextReason="canTextReason"
          @close="closePopup"
        />
        <template v-if="sessionStore.token.email === holiday.owner.email">
          <TwButton
            :cta="t('publish')"
            :disabled="isDisabled"
            :theme="THEME.BLUE"
            v-if="holiday.isDraft"
            @click="setAction('PUBLISH')"
          />
          <TwButton
            :disabled="isDisabled"
            @click="setAction('DRAFT')"
            :cta="t('backToDraft')"
            :theme="THEME.DARK_GRAY"
            v-else
          />
        </template>
        <template v-if="AmIAbleToValidate || sessionStore.token.isSuperAdmin">
          <TwButton
            :disabled="isDisabled"
            @click="setAction('VALIDATE')"
            :cta="t('validate')"
            :theme="THEME.GREEN"
          />
          <TwButton
            :disabled="isDisabled"
            @click="setAction('REJECT')"
            :cta="t('reject')"
            :theme="THEME.RED"
          />
        </template>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { THEME } from "@/utils/enum";
import InLoading from "@/components/InLoading.vue";
import ConfirmStatusChangesCard from "@/components/ConfirmStatusChangesCard.vue";
import CloseButton from "@/components/CloseButton.vue";
import HolidayStatus from "@/components/HolidayStatus.vue";
import TwButton from "@/components/TwButton.vue";
import { computed, ref } from "vue";
import type { Reason } from "@/domain/reason";
import { useI18n } from "vue-i18n";
import { useSessionStore } from "@/stores/session";
import { useHolidayStore } from "@/stores/holiday";
import { type Holiday } from "@/domain/holiday";

const sessionStore = useSessionStore();
const holidayStore = useHolidayStore();

const props = defineProps<{
  holiday: Holiday;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "edit"): void;
  (e: "completed"): void;
}>();

const close = (): void => {
  emit("close");
};

const canTextReason = ref<boolean>(false);
const actionToInit = ref<string | undefined>(undefined);

const closePopup = (): void => {
  actionToInit.value = undefined;
};

const AmIAbleToValidate = computed((): boolean => {
  return (
    sessionStore.token.email !== props.holiday.owner.email &&
    sessionStore.token.isAdmin
  );
});

const setAction = async (
  action: "PUBLISH" | "DRAFT" | "VALIDATE" | "REJECT",
): Promise<void> => {
  if (["VALIDATE", "REJECT"].includes(action)) {
    canTextReason.value = true;
  }
  actionToInit.value = action;
};

const isDisabled = computed<boolean>(() => actionToInit.value !== undefined);

const isStatusChangeLoading = ref<boolean>(false);

const confirmChangeStatus = async (reason?: Reason): Promise<void> => {
  isStatusChangeLoading.value = true;
  const holidayId = +props.holiday.id;

  if (actionToInit.value === "DRAFT") {
    await holidayStore.draftHoliday(holidayId);
  }
  if (actionToInit.value === "PUBLISH") {
    await holidayStore.publishHoliday(holidayId);
  }
  if (actionToInit.value === "REJECT") {
    await holidayStore.rejectHoliday({
      holidayId,
      reason,
    });
  }
  if (actionToInit.value === "VALIDATE") {
    await holidayStore.validateHoliday({
      holidayId,
      reason,
    });
  }

  isStatusChangeLoading.value = false;
  actionToInit.value = undefined;
  emit("completed");
};

const { t } = useI18n({
  messages: {
    en: {
      owner: "Owner",
      title: "Titre",
      type: "Type",
      status: "Status",
      period: "Period",
      createdAt: "Created at",
      description: "Description",
      holidayDetails: "Holiday details",
      from: "From",
      to: "To",
      edit: "Edit",
      backToDraft: "Back to draft",
      publish: "Publish",
      validate: "Validate",
      reject: "Reject",
    },
    fr: {
      owner: "Sous la demande de",
      title: "Titre",
      type: "Type",
      status: "Status",
      period: "Période",
      createdAt: "Date de création",
      description: "Description",
      holidayDetails: "Détails du congé",
      from: "Du",
      to: "Au",
      edit: "Editer",
      backToDraft: "Revenir au brouilon",
      publish: "Publier",
      validate: "Valider",
      reject: "Refuser",
    },
  },
});
</script>
