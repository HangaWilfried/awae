<template>
  <ModalWrapper>
    <section class="bg-white rounded-xl flex flex-col w-[90%] max-w-[500px]">
      <section
        class="font-semibold flex flex-col p-4 border-b border-dashed border-gray-200"
      >
        <CloseButton class="self-end" @click="close" />
        <div class="flex flex-col gap-1">
          <h1 class="text-lg font-extrabold">{{ t("formTitle") }}</h1>
          <p class="text-xs font-medium">{{ t("description") }}</p>
        </div>
      </section>
      <section class="p-7 flex flex-col gap-14">
        <TextField :label="t('password')" v-model="password" />
        <div class="flex gap-8 items-stretch justify-end">
          <TwButton
            @click="close"
            :cta="t('cancel')"
            :theme="THEME.BORDER_BLUE"
          />
          <TwButton
            @click="editPassword"
            :isLoading="isLoading"
            :cta="t('save')"
            :theme="THEME.BLUE"
          />
        </div>
      </section>
    </section>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { THEME } from "@/utils/enum";
import useVuelidate from "@vuelidate/core";
import { useUserStore } from "@/stores/user";
import { required } from "@vuelidate/validators";
import TwButton from "@/components/TwButton.vue";
import TextField from "@/components/TextField.vue";
import CloseButton from "@/components/CloseButton.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const userStore = useUserStore();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "refresh"): void;
}>();

const close = (): void => {
  emit("close");
};

const isLoading = ref<boolean>(false);

const password = ref();
const rules = computed(() => ({
  password: {
    required,
  },
}));

const v$ = useVuelidate(rules, { password });

const editPassword = async (): Promise<void> => {
  isLoading.value = true;
  const isFormReady = await v$.value.$validate();
  if (isFormReady) {
    await userStore.resetPassword(password.value);
    emit("refresh");
  }
  isLoading.value = false;
};

const { t } = useI18n({
  messages: {
    en: {
      password: "Password",
      description: "By pressing edit, this will become the new password",
      save: "Edit",
      cancel: "Cancel",
      formTitle: "Edit password Form",
    },
    fr: {
      password: "Mot de passe",
      description:
        "En appuyant sur editer, ceci deviendra le nouveau mot de passe",
      save: "Editer",
      cancel: "Annuler",
      formTitle: "Formulaire d'edition du mot de passe",
    },
  },
});
</script>
