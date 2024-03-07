<template>
  <section
    class="rounded-xl p-7 flex flex-col gap-4 w-[90%] max-w-[500px] bg-white"
  >
    <TextField v-model="state.title" :label="t('title')" />
    <TextareaField v-model="state.description" :label="t('description')" />
    <div class="pt-7 flex gap-2 items-center">
      <TwButton
        @click="$emit('close')"
        :cta="t('Cancel')"
        :theme="THEME.BORDER_BLUE"
      />
      <TwButton
        :is-loading="isLoading"
        :disabled="!canSave"
        @click="save"
        :cta="t('Save')"
        :theme="THEME.BLUE"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { THEME } from "@/utils/enum";
import { computed, reactive, ref } from "vue";
import { useHolidayStore } from "@/stores/holiday";
import type { HolidayType } from "@/domain/config";
import { type Holiday, NullablePeriod } from "@/domain/holiday";

import TwButton from "@/components/TwButton.vue";
import TextField from "@/components/TextField.vue";
import TextareaField from "@/components/TextareaField.vue";

const holidayStore = useHolidayStore();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "completed"): void;
}>();

const { t } = useI18n({
  messages: {
    en: {
      save: "Save",
      title: "Title",
      cancel: "Cancel",
      description: "Description",
    },
    fr: {
      title: "Titre",
      cancel: "Annuler",
      save: "Enregistrer",
      description: "Description",
    },
  },
});

const props = defineProps<{
  holiday: Holiday;
}>();

type State = {
  title: string;
  type: HolidayType;
  description: string;
  period: {
    end: string;
    start: string;
  };
};

const state = reactive<State>({
  title: props.holiday.title,
  type: props.holiday.type,
  description: props.holiday.description,
  period: {
    end: props.holiday.validity.endDate,
    start: props.holiday.validity.startDate,
  },
});

const canSave = computed(
  (): boolean =>
    JSON.stringify({
      title: props.holiday.title,
      type: props.holiday.type,
      description: props.holiday.description,
      period: {
        end: props.holiday.validity.endDate,
        start: props.holiday.validity.startDate,
      },
    }) !== JSON.stringify(state),
);

const isLoading = ref<boolean>(false);
const save = async (): Promise<void> => {
  isLoading.value = true;

  const holiday = props.holiday;

  const period = NullablePeriod();
  period.endDate = state.period.end;
  period.startDate = state.period.start;

  holiday.validity = period;
  holiday.title = state.title;
  holiday.type = state.type as HolidayType;
  holiday.description = state.description;

  await holidayStore.editHoliday(holiday);
  isLoading.value = false;
  emit("completed");
};
</script>
