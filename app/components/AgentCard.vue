<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    phone?: string | null;
    title?: string;
  }>(),
  { title: "Makelaar", phone: null },
)
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4">
    <h3 class="mb-2 text-sm font-semibold text-gray-900">{{ title }}</h3>
    <p class="text-sm text-gray-700">{{ name }}</p>
    <p v-if="phone" class="mt-1 text-sm text-funda-blue">{{ phone }}</p>
  </div>
</template>
