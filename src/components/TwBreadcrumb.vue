<template>
  <section class="flex items-center gap-2">
    <div
      :class="[
        'flex gap-2 items-center',
        isLastIndex(index)
          ? 'font-bold'
          : 'text-gray-700 font-semibold text-xs cursor-pointer',
      ]"
      v-for="(crumb, index) in breadcrumb"
      :key="crumb.name"
    >
      <span @click="goTo(index, crumb)">{{ crumb.name }}</span>
      <ArrowIcon v-if="!isLastIndex(index)" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Link } from "@/utils/type";
import ArrowIcon from "@/components/svg/ArrowIcon.vue";

const props = defineProps<{
  breadcrumb: Link[];
}>();

const isLastIndex = (index: number): boolean => {
  const totalItems = props.breadcrumb.length - 1;
  return totalItems === index;
};

const router = useRouter();
const goTo = async (index: number, link: Link): Promise<void> => {
  if (isLastIndex(index)) return;
  await router.push(link.path);
};
</script>
