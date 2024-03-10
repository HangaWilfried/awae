<script setup lang="ts">
import { reactive, watchEffect } from "vue";
import type { ListItem } from "@/utils/interface";
import ArrowUpIcon from "@/components/svg/ArrowUpIcon.vue";

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
    JSON.stringify(current)?.toLowerCase() ===
    JSON.stringify(next)?.toLowerCase()
  );
};

const effect = watchEffect(() => {
  if (model.value && props.options.length) {
    state.option = props.options.find((option) =>
      isSameData(option.item, model.value),
    );
    effect();
  }
});
</script>

<template>
  <section class="relative">
    <div class="flex flex-col gap-0.5 lg:gap-2">
      <label :for="label">
        <slot :label="label">
          <span>{{ label }}</span>
        </slot>
      </label>
      <div class="grid relative">
        <input
          :value="state.option?.text"
          :id="label"
          type="text"
          readonly
          class="outline-none border border-gray-300 focus:border-2 focus:border-blue-400 rounded lg:rounded-lg p-2.5"
        />
        <div
          :data-test="`display-${label}-list`"
          @click="state.shouldDisplayOptions = !state.shouldDisplayOptions"
          class="hover:bg-blue-50 p-2 rounded-md absolute cursor-pointer top-1.5 right-2"
        >
          <ArrowUpIcon
            :class="[
              'duration-300 ease-linear transition',
              state.shouldDisplayOptions ? 'rotate-0' : 'rotate-180',
            ]"
          />
        </div>
      </div>
    </div>
    <div
      v-if="state.shouldDisplayOptions"
      class="flex flex-col shadow-lg p-2 border rounded gap-3 bg-white absolute top-20 z-40 w-full left-0 h-52 overflow-auto"
    >
      <div
        :data-test="`option-${option.text}`"
        :class="[
          'p-2 rounded cursor-pointer',
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
