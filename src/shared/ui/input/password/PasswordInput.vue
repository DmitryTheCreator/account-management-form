<template>
  <div class="ui-input--password-wrapper">
    <BaseInput v-bind="attrs" v-model="model" :type="type" />

    <span class="ui-input__toggle" @click="togglePassword">
      <Eye :size="iconSize" v-if="passwordVisible" />
      <EyeOff :size="iconSize" v-else />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue";
import { BaseInput } from "..";
import { Eye, EyeOff } from "lucide-vue-next";

const attrs = useAttrs();

interface IProps {
  modelValue?: string | null;
}

const { modelValue = "" } = defineProps<IProps>();
const emit = defineEmits<{
  "update:modelValue": [modelValue: string | null];
}>();

const model = computed({
  get: () => modelValue,
  set: (value: string) => {
    emit("update:modelValue", value);
  },
});

watch(
  () => modelValue,
  (newVal) => {
    if (newVal !== model.value) {
      model.value = newVal || "";
    }
  },
);

const passwordVisible = ref(false);
const togglePassword = () => {
  passwordVisible.value = !passwordVisible.value;
};

const type = computed(() => {
  return passwordVisible.value ? "text" : "password";
});
const iconSize = 20;
</script>

<style lang="scss">
@use "styles";
</style>
