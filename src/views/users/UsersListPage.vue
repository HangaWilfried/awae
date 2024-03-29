<template>
  <section class="p-4 space-y-7">
    <AddUser
      @refresh="fetchAllUsers"
      v-if="shouldDisplayAddUserModal"
      @close="shouldDisplayAddUserModal = false"
    />
    <section class="flex justify-between items-center">
      <h2 class="flex flex-col font-sans font-medium">
        <span class="text-blue-800 text-xl">
          {{ t("users", { total: state.rows.length }) }}
        </span>
        <span class="text-xs text-gray-800 font-bold">
          {{ t("description") }}
        </span>
      </h2>
      <TwButton
        :cta="t('addUser')"
        :theme="THEME.BLUE"
        @click="shouldDisplayAddUserModal = true"
      />
    </section>
    <InLoading v-if="isLoading" />
    <section v-else>
      <table class="w-full flex flex-col text-xs">
        <thead>
          <tr
            class="grid grid-cols-5 rounded px-2 py-1 bg-gray-200 text-gray-700"
          >
            <th class="text-left" v-for="column in columns" :key="column">
              {{ t(column.toLowerCase()) }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="cursor-pointer grid grid-cols-5 px-3 py-2"
            :key="row.id"
            v-for="row in state.rows"
            :data-test="`user-${row.id}`"
            @click="goToUserDetailsPage(row.id)"
          >
            <td
              class="first:text-blue-800 first:font-medium"
              v-for="column in columns"
              :key="column"
            >
              <span
                :class="[
                  {
                    'text-green-600': row.getTextFor(column) === 'superAdmin',
                    'text-purple-600': row.getTextFor(column) === 'admin',
                    'text-orange-600': row.getTextFor(column) === 'employee',
                  },
                  'font-bold',
                ]"
                v-if="column === 'ROLE'"
              >
                {{ t(row.getTextFor(column)) }}
              </span>
              <span class="break-all" v-else>{{ row.getTextFor(column) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { User } from "@/domain/user";
import { useUserStore } from "@/stores/user";
import AddUser from "@/components/AddUser.vue";
import { TABLE_ROW, THEME } from "@/utils/enum";
import TwButton from "@/components/TwButton.vue";
import { onBeforeMount, reactive, ref } from "vue";
import InLoading from "@/components/InLoading.vue";

const userStore = useUserStore();
const columns = Object.keys(TABLE_ROW);

const shouldDisplayAddUserModal = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const router = useRouter();
const goToUserDetailsPage = async (userId: string): Promise<void> => {
  await router.push(`/users/${userId}`);
};

type State = {
  rows: User[];
};

const state = reactive<State>({
  rows: [],
});

const fetchAllUsers = async (): Promise<void> => {
  isLoading.value = true;
  shouldDisplayAddUserModal.value = false;
  state.rows = await userStore.getAllEmployees();
  isLoading.value = false;
};

onBeforeMount(async () => {
  await fetchAllUsers();
});

const { t } = useI18n({
  messages: {
    en: {
      email: "Email",
      first_name: "First name",
      last_name: "Last name",
      date_of_birth: "Date of birth",
      addUser: "+ Add",
      users: "System users ({total})",
      description: "Here you will find the list of system users.",
      admin: "Admin",
      employee: "Employee",
      superAdmin: "Owner",
      role: "Role",
    },
    fr: {
      email: "Email",
      first_name: "Prénom",
      last_name: "Nom",
      date_of_birth: "Date de naissance",
      addUser: "+ Ajouter",
      users: "Utilisateurs du système ({total})",
      description: "Ici, vous trouverez la liste des utilisateurs du système.",
      admin: "Administrateur",
      employee: "Employé",
      superAdmin: "Propriétaire",
      role: "Role",
    },
  },
});
</script>
