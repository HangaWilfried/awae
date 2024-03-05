<script setup lang="ts">
import { onBeforeMount } from "vue";
import { RouterView } from "vue-router";

onBeforeMount(() => {
  localStorage.clear();
});
</script>

<template>
  <RouterView />
</template>
