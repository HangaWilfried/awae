<script setup lang="ts">
import { useI18n } from "vue-i18n";

import TwButton from "@/components/TwButton.vue";
import CloseButton from "@/components/CloseButton.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";
import { THEME } from "@/utils/enum";

defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();

const { t } = useI18n({
  messages: {
    en: {
      description: "Description",
      title: "Confirm, will cause a disconnection",
      confirm: "confirm",
      cancel: "Cancel",
      formTitle: "Logout",
    },
    fr: {
      title: "Confirmer, entrenera une deconnexion",
      confirm: "Confirmer",
      cancel: "Annuler",
      formTitle: "Déconnexion",
    },
  },
});
</script>

<template>
  <ModalWrapper>
    <section class="bg-white rounded-xl flex flex-col w-[90%] max-w-[500px]">
      <section
        class="font-semibold flex justify-between items-start p-4 border-b border-dashed border-gray-200"
      >
        <div class="flex flex-col gap-1 text-gray-900 font-bold">
          <span class="text-xl">{{ t("formTitle") }}</span>
          <span class="text-sm">{{ t("title") }}</span>
        </div>
        <CloseButton @click="$emit('close')" />
      </section>
      <div class="px-5 !text-sm py-10 flex gap-4 items-center">
        <TwButton
          :cta="t('cancel')"
          :theme="THEME.BORDER_BLUE"
          @click="$emit('close')"
        />
        <TwButton
          :cta="t('confirm')"
          :theme="THEME.BLUE"
          @click="$emit('confirm')"
        />
      </div>
    </section>
  </ModalWrapper>
</template>

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
