<template>
  <input
    class="ui-input"
    :type="type"
    :value="modelValue"
    @input="updateValue"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, InputTypeHTMLAttribute } from "vue";

interface IProps {
  modelValue?: string | number;
  type?: InputTypeHTMLAttribute;
}

const { modelValue = "", type = "text" } = defineProps<IProps>();
const emit = defineEmits<{
  "update:modelValue": [modelValue: string];
}>();

const updateValue = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update:modelValue", input.value);
};
</script>

<style lang="scss">
@use "styles";
</style>
