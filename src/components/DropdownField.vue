<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import type { ListItem } from "@/utils/interface";

const props = defineProps<{
  options: ListItem<unknown>[];
  label: string;
}>();

const model = defineModel<unknown>();

type State = {
  shouldDisplayOptions: boolean;
  option: undefined | ListItem<unknown>;
};

const state = reactive<State>({
  shouldDisplayOptions: false,
  option: undefined,
});

const select = (option: ListItem<unknown>): void => {
  state.shouldDisplayOptions = false;
  state.option = option;
  model.value = option.item;
};

const isSameData = (current: unknown, next: unknown): boolean => {
  return (
    JSON.stringify(current).toLowerCase() === JSON.stringify(next).toLowerCase()
  );
};

onBeforeMount(() => {
  if (model.value) {
    state.option = props.options.find((option) =>
      isSameData(option.item, model.value),
    );
  }
});
</script>

<template>
  <section class="relative">
    <label class="flex flex-col" :for="label">
      <slot :label="label">
        <span>{{ label }}</span>
      </slot>
      <input
        @click="state.shouldDisplayOptions = !state.shouldDisplayOptions"
        :value="state.option?.text"
        :id="label"
        type="text"
        readonly
        class="outline-none border border-gray-300 focus:border-2 focus:border-blue-400 rounded lg:rounded-lg p-2.5"
      />
    </label>
    <div
      v-if="state.shouldDisplayOptions"
      class="flex flex-col shadow border rounded-lg gap-2 bg-white absolute top-20 z-10 w-full p-2 left-0 h-28 overflow-auto"
    >
      <div
        :class="[
          'p-2 rounded-lg cursor-pointer',
          isSameData(option, state.option)
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800',
        ]"
        @click="select(option)"
        v-for="option in options"
        :key="option.id"
      >
        {{ option.text }}
      </div>
    </div>
  </section>
</template>
