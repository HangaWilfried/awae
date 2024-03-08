<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { onBeforeMount, reactive, ref } from "vue";
import type { HolidayForm } from "@/domain/holiday";

import { THEME } from "@/utils/enum";
import { useHolidayStore } from "@/stores/holiday";
import { HolidayTypeItem } from "@/utils/interface";
import { NullableHolidayType } from "@/domain/config";
import { useHolidayConfigStore } from "@/stores/config";

import TwButton from "@/components/TwButton.vue";
import TextField from "@/components/TextField.vue";
import DateField from "@/components/DateField.vue";
import DropdownField from "@/components/DropdownField.vue";
import TextareaField from "@/components/TextareaField.vue";
import CloseButton from "@/components/CloseButton.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const holidayStore = useHolidayStore();
const configStore = useHolidayConfigStore();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "getDetails", id: number): void;
}>();

const { t } = useI18n({
  messages: {
    en: {
      type: "Type",
      description: "Description",
      title: "Title",
      to: "To",
      from: "From",
      create: "Create",
      cancel: "Cancel",
      formTitle: "Form to request holiday",
    },
    fr: {
      type: "Type",
      description: "Description",
      title: "Titre",
      to: "Au",
      from: "Du",
      create: "Créer",
      cancel: "Abandonner",
      formTitle: "Formulaire de demande de congé",
    },
  },
});

const holidaysTypes = ref<HolidayTypeItem[]>([]);
onBeforeMount(async () => {
  const types = await configStore.getAllHolidaysTypes();
  holidaysTypes.value = types.map((type) => new HolidayTypeItem(type));
});

const holiday = reactive<HolidayForm>({
  title: "",
  type: NullableHolidayType(),
  from: "",
  to: "",
  description: "",
});

const isLoading = ref<boolean>(false);
const close = (): void => {
  emit("close");
};
const createHoliday = async (): Promise<void> => {
  isLoading.value = true;
  const holidayId = await holidayStore.createHoliday({
    holiday: holiday as HolidayForm,
  });
  if (holidayId) {
    emit("getDetails", holidayId);
  }
  isLoading.value = false;
};
</script>

<template>
  <ModalWrapper>
    <section class="bg-white rounded-xl flex flex-col w-[90%] max-w-[500px]">
      <section
        class="font-semibold flex flex-col p-4 border-b border-dashed border-gray-200"
      >
        <CloseButton class="self-end" @click="close" />
        <div class="text-lg">{{ t("formTitle") }}</div>
      </section>
      <section class="p-5 flex flex-col gap-4">
        <TextField v-model="holiday.title" :label="t('title')" />
        <DropdownField
          v-model="holiday.type"
          :options="holidaysTypes"
          :label="t('type')"
        />
        <DateField v-model="holiday.from" :label="t('from')" />
        <DateField v-model="holiday.to" :label="t('to')" />
        <TextareaField
          v-model="holiday.description"
          :label="t('description')"
        />
        <div class="flex gap-2 justify-end items-center">
          <TwButton
            :cta="t('cancel')"
            :theme="THEME.BORDER_BLUE"
            @click="close"
          />
          <TwButton
            :cta="t('create')"
            :theme="THEME.BLUE"
            @click="createHoliday"
          />
        </div>
      </section>
    </section>
  </ModalWrapper>
</template>