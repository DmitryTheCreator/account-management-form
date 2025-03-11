<template>
  <button type="button" class="ui-button" :class="variantClass">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "dark";
}

const props = defineProps<Props>();

const variantClass = computed(() => `ui-button--${props.variant || "primary"}`);
</script>

<style scoped lang="scss">
@use "styles";
</style>
