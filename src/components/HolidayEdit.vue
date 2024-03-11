<template>
  <section
    class="rounded-xl p-7 flex flex-col gap-4 w-[90%] max-w-[500px] bg-white"
  >
    <TextField v-model="state.title" :label="t('title')" />
    <DropdownField
      v-model="state.type"
      :options="holidaysTypes"
      :label="t('type')"
    />
    <Transition name="slide-fade">
      <HowItWorks :config="config" v-if="!state.type.isNull" />
    </Transition>
    <DateField v-model="state.period.start" :label="t('from')" />
    <DateField v-model="state.period.end" :label="t('to')" />
    <TextareaField v-model="state.description" :label="t('description')" />
    <div class="pt-7 flex gap-2 items-center">
      <TwButton
        @click="$emit('close')"
        :cta="t('cancel')"
        :theme="THEME.BORDER_BLUE"
      />
      <TwButton
        :is-loading="isLoading"
        :disabled="!canSave"
        @click="save"
        :cta="t('save')"
        :theme="canSave ? THEME.BLUE : THEME.GRAY"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { THEME } from "@/utils/enum";
import { computed, onBeforeMount, reactive, type Ref, ref, watch } from "vue";

import { useHolidayStore } from "@/stores/holiday";
import { useHolidayConfigStore } from "@/stores/config";

import { HolidayTypeItem } from "@/utils/interface";
import {
  HolidayConfig,
  type HolidayType,
  NullableHolidayConfig,
} from "@/domain/config";
import { type Holiday, NullablePeriod } from "@/domain/holiday";

import TwButton from "@/components/TwButton.vue";
import TextField from "@/components/TextField.vue";
import DateField from "@/components/DateField.vue";
import HowItWorks from "@/components/HowItWorks.vue";
import TextareaField from "@/components/TextareaField.vue";
import DropdownField from "@/components/DropdownField.vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { getUTC } from "@/utils/clock";

const holidayStore = useHolidayStore();
const configStore = useHolidayConfigStore();

const holidaysTypes = ref<HolidayTypeItem[]>([]);
const getHolidayTypes = async (): Promise<void> => {
  const types = await configStore.getAllHolidaysTypes();
  holidaysTypes.value = types.map((type) => new HolidayTypeItem(type));
};

const emit = defineEmits<{
  (e: "close"): void;
  (e: "completed"): void;
}>();

const { t } = useI18n({
  messages: {
    en: {
      to: "To",
      from: "From",
      type: "Type",
      save: "Save",
      title: "Title",
      cancel: "Cancel",
      description: "Description",
    },
    fr: {
      to: "Au",
      from: "Du",
      type: "Type",
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

const config = ref<HolidayConfig>(
  NullableHolidayConfig(),
) as Ref<HolidayConfig>;
const getConfigDetails = async (): Promise<void> => {
  config.value = await configStore.getActivatedConfigByHolidayType(
    +state.type.id,
  );
};

watch(
  () => state.type.id,
  async () => {
    await getConfigDetails();
  },
);

const rules = computed(() => ({
  type: {
    required,
  },
  period: {
    start: { required },
    end: { required },
  },
}));

const v$ = useVuelidate(rules, state);

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
    }) !== JSON.stringify(state) && !v$.value.$invalid,
);

const isLoading = ref<boolean>(false);
const save = async (): Promise<void> => {
  isLoading.value = true;

  const holiday = props.holiday;

  const period = NullablePeriod();
  period.endDate = getUTC(state.period.end);
  period.startDate = getUTC(state.period.start);

  holiday.validity = period;
  holiday.title = state.title;
  holiday.type = state.type as HolidayType;
  holiday.description = state.description;

  await holidayStore.editHoliday(holiday);
  isLoading.value = false;
  emit("completed");
};

onBeforeMount(async () => {
  await Promise.all([getHolidayTypes(), getConfigDetails()]);
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
