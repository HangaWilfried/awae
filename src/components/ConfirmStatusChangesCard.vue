<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { THEME } from "@/utils/enum";
import { NullableReason, Reason } from "@/domain/reason";
import TwButton from "@/components/TwButton.vue";
import CloseButton from "@/components/CloseButton.vue";
import TextareaField from "@/components/TextareaField.vue";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "try", id: Reason): void;
}>();

defineProps<{
  isBusy: boolean;
  action: string;
  canTextReason: boolean;
}>();

const { t } = useI18n({
  messages: {
    en: {
      yes: "Yes",
      draft: "Are you sure to draft this holiday request",
      reject: "Are you sure to reject this holiday request",
      publish: "Are you sure to publish this holiday request",
      validate: "Are you sure to validate this holiday request",
    },
    fr: {
      yes: "Oui",
      draft: "Etes-vous sur de revenir au brouillon",
      reject: "Etes-vous sur de rejeter cette demande de congé",
      publish: "Etes-vous sur de publier cette demande de congé",
      validate: "Etes-vous sur de valider cette demande de congé",
    },
  },
});

const message = ref<string>("");
const initAction = async (): Promise<void> => {
  const reason = NullableReason();
  reason.why = message.value;
  emit("try", reason);
};
</script>

<template>
  <section
    class="flex absolute -left-40 -top-20 z-40 flex-col divide-y bg-gray-100 text-gray-800 divide-gray-300 rounded-md drop-shadow-lg shadow-xl"
  >
    <div class="flex p-2">
      <CloseButton @click="$emit('close')" />
    </div>
    <TextareaField
      class="px-2 py-7"
      v-model="message"
      :label="t('reason')"
      v-if="canTextReason"
    />
    <div class="!text-sm px-4 py-6 flex justify-between items-end">
      <span class="font-bold w-72">{{ t(action.toLowerCase()) }}</span>
      <TwButton
        :cta="t('yes')"
        class="!bg-indigo-600"
        :theme="THEME.LIGHT_BLUE"
        @click="initAction"
        :isLoading="isBusy"
      />
    </div>
  </section>
</template>
