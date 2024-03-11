<script setup lang="ts">
import ModalWrapper from "@/components/ModalWrapper.vue";
import HolidayDetails from "@/components/HolidayDetails.vue";
import { onBeforeMount, type Ref, ref } from "vue";
import { useHolidayStore } from "@/stores/holiday";
import { type Holiday, NullableHoliday } from "@/domain/holiday";
import HolidayEdit from "@/components/HolidayEdit.vue";

const holidayStore = useHolidayStore();
const holiday = ref<Holiday>(NullableHoliday()) as Ref<Holiday>;
const isLoading = ref<boolean>(false);
const shouldDisplayEditionForm = ref<boolean>(false);

const props = defineProps<{
  holidayId: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const close = (): void => {
  emit("close");
};
const fetchDetails = async (): Promise<void> => {
  shouldDisplayEditionForm.value = false;
  isLoading.value = true;
  holiday.value = await holidayStore.getHolidayById(props.holidayId);
  isLoading.value = false;
};

onBeforeMount(async () => {
  await fetchDetails();
});
</script>

<template>
  <ModalWrapper>
    <transition>
      <HolidayEdit
        :holiday="holiday"
        @completed="fetchDetails"
        v-if="shouldDisplayEditionForm"
        @close="shouldDisplayEditionForm = false"
      />
      <HolidayDetails
        v-else
        :holiday="holiday"
        @close="close"
        :is-loading="isLoading"
        @completed="fetchDetails"
        @edit="shouldDisplayEditionForm = true"
      />
    </transition>
  </ModalWrapper>
</template>
