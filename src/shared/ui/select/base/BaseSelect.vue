<template>
  <select class="ui-select" v-model="selectedValue">
    <option v-for="option in localOptions" :key="getOptionValue(option)">
      {{ getOptionLabel(option) }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Primitive = string | number | boolean | symbol | bigint | null | undefined;
type OptionObject = Record<string, unknown>;

interface IProps {
  modelValue?: unknown;
  options: Primitive[] | OptionObject[];
  optionValue?: string;
  optionLabel?: string;
}

const emit = defineEmits<{
  "update:modelValue": [modelValue: string];
}>();

const {
  modelValue,
  options,
  optionValue = "id",
  optionLabel = "label",
} = defineProps<IProps>();

interface TransformedOption extends Record<string, unknown> {
  [key: string]: unknown;
  label: Primitive;
}

const localOptions = computed<(Primitive | TransformedOption)[]>(() => {
  if (options.every(isPrimitive)) {
    return options.map(
      (value, index) =>
        ({
          [optionValue]: index,
          [optionLabel]: value,
        }) as TransformedOption,
    );
  }
  return options as (Primitive | TransformedOption)[];
});

const selectedValue = computed({
  get: () => modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const isPrimitive = (value: unknown): value is Primitive => {
  return (
    value === null || (typeof value !== "object" && typeof value !== "function")
  );
};

const getOptionValue = (option: Primitive | TransformedOption) => {
  if (isPrimitive(option)) {
    return option?.toString() ?? "";
  }

  const value = option[optionValue];
  return typeof value === "string" || typeof value === "number"
    ? value
    : JSON.stringify(value);
};

const getOptionLabel = (option: Primitive | TransformedOption) => {
  return isPrimitive(option) ? option : option[optionLabel];
};
</script>

<style lang="scss">
@use "styles";
</style>
