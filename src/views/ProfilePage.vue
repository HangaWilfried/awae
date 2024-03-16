<template>
  <div>
    <UserDetails :userId="item" />
  </div>
</template>

<script setup lang="ts">
import UserDetails from "@/components/UserDetails.vue";
import { useSessionStore } from "@/stores/session";

const session = useSessionStore();

const item = "1";
</script>
