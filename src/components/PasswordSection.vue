<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import EditPassword from "@/components/EditPassword.vue";
import ClipboardIcon from "@/components/svg/ClipboardIcon.vue";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  userId?: string;
}>();

const userStore = useUserStore();

const secret = ref<string>("");
const isCopySucceed = ref<boolean>(false);
const shouldEditPassword = ref<boolean>(false);

const isPasswordLoading = ref<boolean>(false);

const copy = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(secret.value);
    isCopySucceed.value = true;
    const timeoutId = setTimeout(() => {
      isCopySucceed.value = false;
      clearTimeout(timeoutId);
    }, 1000);
  } catch (error) {
    console.log(error);
  }
};

const fetchPassword = async (): Promise<void> => {
  isPasswordLoading.value = true;
  if (props.userId) {
    const password = await userStore.getPasswordByUserId(+props.userId);
    if (password) {
      secret.value = password;
    }
  }
  isPasswordLoading.value = false;
};

onBeforeMount(async () => {
  await fetchPassword();
});

const { t } = useI18n({
  messages: {
    en: {
      edit: "Edit",
      password: "Password",
      copied: "Copied",
    },
    fr: {
      edit: "Editer",
      password: "Mot de passe",
      copied: "Copié",
    },
  },
});
</script>

<template>
  <section
    class="border bg-white border-gray-300/70 flex flex-col gap-2 rounded-lg p-8"
  >
    <EditPassword
      @close="shouldEditPassword = false"
      @refresh="fetchPassword"
      v-if="shouldEditPassword"
    />
    <span class="loader !w-12 !h-12" v-if="isPasswordLoading"></span>
    <template v-else>
      <span class="text-gray-800 font-bold">{{ t("password") }}</span>
      <div class="flex justify-between items-center gap-4">
        <div
          @click="shouldEditPassword = true"
          class="flex gap-1 font-bold items-center text-blue-400 cursor-pointer rounded-xl border-2 border-blue-400 px-2 py-[0.5px]"
        >
          <span class="text-xs">{{ t("edit") }}</span>
        </div>
        <div class="flex items-center border rounded justify-between divide-x">
          <input
            type="password"
            readonly
            class="basis-full px-2 rounded text-gray-500 outline-none"
            :value="secret"
          />
          <div
            @click="copy"
            :class="[
              'py-0.5 px-2 cursor-pointer transition ease-linear relative font-bold',
              isCopySucceed ? 'text-blue-400' : 'text-gray-400',
            ]"
          >
            <ClipboardIcon />
            <transition>
              <span
                v-if="isCopySucceed"
                class="text-blue-400 font-bold text-xs absolute"
              >
                {{ t("copied") }}
              </span>
            </transition>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
