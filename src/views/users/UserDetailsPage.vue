<template>
  <main class="space-y-4 p-4">
    <EditPassword
      @close="shouldEditPassword = false"
      @refresh="fetchPassword"
      v-if="shouldEditPassword"
    />
    <EditUser
      :user="user"
      v-if="shouldEditUser && user"
      @refresh="fetchUserDetails"
      @close="shouldEditUser = false"
    />
    <section class="flex justify-between items-center">
      <TwBreadcrumb :breadcrumb="breadcrumb" />
      <TwButton
        :cta="t('edit')"
        :theme="THEME.BLUE"
        @click="shouldEditUser = true"
      />
    </section>
    <section class="border border-gray-300/70 rounded-lg">
      <InLoading v-if="isLoading" />
      <section
        v-else
        class="space-y-4 bg-white rounded-xl p-8 flex justify-between"
      >
        <section class="flex flex-col gap-y-7" v-if="user">
          <DetailItem :label="t('email')" :value="user.email" />
          <DetailItem :label="t('first_name')" :value="user.firstname" />
          <DetailItem :label="t('last_name')" :value="user.lastname" />
          <DetailItem :label="t('date_of_birth')" :value="user.dateOfBirth" />
        </section>
        <section class="p-12">
          <div
            class="rounded-lg p-8 w-32 h-32 flex justify-center items-center bg-gray-100"
          >
            <UserIcon class="h-10 w-10" />
          </div>
        </section>
      </section>
    </section>
    <section
      class="border bg-white border-gray-300/70 flex flex-col gap-2 rounded-lg p-4"
    >
      <InLoading v-if="isPasswordLoading" />
      <template v-else>
        <span class="text-gray-800 font-bold">{{ t("password") }}</span>
        <div class="flex justify-between items-center gap-4">
          <div
            @click="shouldEditPassword = true"
            class="flex gap-1 font-bold items-center text-blue-400 cursor-pointer rounded-xl border-2 border-blue-400 px-2 py-[0.5px]"
          >
            <span class="text-xs">{{ t("edit") }}</span>
          </div>
          <div
            class="flex items-center border rounded justify-between divide-x bg-gray-50"
          >
            <input
              type="password"
              readonly
              class="basis-full px-2 rounded bg-gray-50 text-gray-500 outline-none"
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
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { THEME } from "@/utils/enum";
import { useRouter } from "vue-router";
import { computed, onBeforeMount, ref } from "vue";
import type { User } from "@/domain/user";
import { useUserStore } from "@/stores/user";
import EditUser from "@/components/EditUser.vue";
import TwButton from "@/components/TwButton.vue";
import InLoading from "@/components/InLoading.vue";
import DetailItem from "@/components/DetailItem.vue";
import UserIcon from "@/components/svg/UserIcon.vue";
import type { Link } from "@/utils/type";
import TwBreadcrumb from "@/components/TwBreadcrumb.vue";
import ClipboardIcon from "@/components/svg/ClipboardIcon.vue";
import EditPassword from "@/components/EditPassword.vue";

const props = defineProps<{
  userId?: string;
}>();

const userStore = useUserStore();

const user = ref<User>();
const secret = ref<string>("");

const isLoading = ref<boolean>(false);
const isCopySucceed = ref<boolean>(false);
const shouldEditUser = ref<boolean>(false);
const isPasswordLoading = ref<boolean>(false);
const shouldEditPassword = ref<boolean>(false);

const breadcrumb = computed<Link[]>(() => [
  {
    name: t("users"),
    path: "/users",
  },
  {
    name: user.value?.lastname as string,
    path: "",
  },
]);

const router = useRouter();

const fetchUserDetails = async (): Promise<void> => {
  shouldEditUser.value = false;
  isLoading.value = true;
  if (props.userId) {
    user.value = await userStore.getEmployeeById(+props.userId);
    isLoading.value = false;
  } else {
    isLoading.value = false;
    await router.push("/403");
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

onBeforeMount(async () => {
  await Promise.all([fetchUserDetails(), fetchPassword()]);
});

const { t } = useI18n({
  messages: {
    en: {
      email: "E-mail",
      first_name: "First name",
      last_name: "Last name",
      date_of_birth: "Date of birth",
      edit: "Edit",
      users: "Users",
      password: "Password",
      copied: "Copied",
    },
    fr: {
      email: "E-mail",
      first_name: "Prénom",
      last_name: "Nom",
      date_of_birth: "Date de naissance",
      edit: "Editer",
      users: "Utilisateurs",
      password: "Mot de passe",
      copied: "Copié",
    },
  },
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
