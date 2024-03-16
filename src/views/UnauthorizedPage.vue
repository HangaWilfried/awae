<template>
  <div class="min-h-screen w-full flex justify-center items-center">
    <span class="p-3 text-xl font-bold border-r border-gray-400">403</span>
    <div class="flex flex-col text-sm px-4">
      <span>{{ t("unauthorized") }}</span>
      <span
        @click="backToSafeRoute"
        class="text-blue-500 underline underline-offset-2 cursor-pointer"
      >
        {{ t("back") }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const backToSafeRoute = async (): Promise<void> => {
  const safeRoute = localStorage.getItem("safeRoute");
  if (safeRoute) {
    await router.push(safeRoute);
  }
};

const { t } = useI18n({
  messages: {
    en: {
      unauthorized: "Unauthorized",
      back: "Back to AWAE",
    },
    fr: {
      unauthorized: "Pas autorisé",
      back: "Retourner vers AWAE",
    },
  },
});
</script>
