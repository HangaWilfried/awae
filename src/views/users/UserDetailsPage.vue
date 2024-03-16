<template>
  <main class="flex flex-col gap-y-4 p-4">
    <EditUser
      :user="user"
      v-if="shouldEditUser && user"
      @refresh="fetchUserDetails"
      @close="shouldEditUser = false"
    />
    <TwBreadcrumb :breadcrumb="breadcrumb" />
    <section
      class="border border-gray-300/70 rounded-lg bg-white p-8 flex flex-col"
    >
      <span class="loader !w-12 !h-12" v-if="isLoading"></span>
      <section v-else class="space-y-6 rounded-xl">
        <div class="relative -top-4">
          <TwButton
            :cta="t('edit')"
            :theme="THEME.BLUE"
            @click="shouldEditUser = true"
          />
        </div>
        <section class="flex justify-between">
          <section class="flex flex-col gap-y-4" v-if="user">
            <DetailItem :label="t('email')" :value="user.email" />
            <DetailItem :label="t('first_name')" :value="user.firstname" />
            <DetailItem :label="t('last_name')" :value="user.lastname" />
            <DetailItem :label="t('date_of_birth')" :value="user.dateOfBirth" />
          </section>
          <img
            :src="imagePreview"
            class="object-scale-down w-24 h-20"
            alt="mountain-placeholder"
          />
        </section>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { THEME } from "@/utils/enum";
import { useRouter } from "vue-router";
import type { Link } from "@/utils/type";
import type { User } from "@/domain/user";
import { useUserStore } from "@/stores/user";
import EditUser from "@/components/EditUser.vue";
import TwButton from "@/components/TwButton.vue";
import DetailItem from "@/components/DetailItem.vue";
import TwBreadcrumb from "@/components/TwBreadcrumb.vue";
import { computed, onBeforeMount, ref } from "vue";

const props = defineProps<{
  userId?: string;
}>();

const userStore = useUserStore();

const user = ref<User>();

const isLoading = ref<boolean>(false);

const shouldEditUser = ref<boolean>(false);

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

onBeforeMount(async () => {
  await fetchUserDetails();
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
    },
    fr: {
      email: "E-mail",
      first_name: "Prénom",
      last_name: "Nom",
      date_of_birth: "Date de naissance",
      edit: "Editer",
      users: "Utilisateurs",
    },
  },
});

const imagePreview = computed<string>(
  () => new URL("@/assets/preview.png", import.meta.url).href,
);
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
