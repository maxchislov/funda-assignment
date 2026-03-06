<script setup lang="ts">
defineProps<{
  specs: { label: string; value: string | number }[];
}>();
</script>

<template>
  <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
    <div
      v-for="spec in specs"
      :key="spec.label"
      class="rounded-lg border border-gray-200 bg-white px-3 py-2"
    >
      <p class="text-xs text-gray-500">{{ spec.label }}</p>
      <p class="font-semibold text-gray-900">{{ spec.value }}</p>
    </div>
  </div>
</template>
