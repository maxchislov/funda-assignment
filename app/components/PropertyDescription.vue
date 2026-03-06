<script setup lang="ts">
// Funda returns HTML in VolledigeOmschrijving, so we sanitize to prevent XSS.
import DOMPurify from "isomorphic-dompurify"

const props = defineProps<{
  html: string;
}>()

const sanitized = computed(() => DOMPurify.sanitize(props.html))
</script>

<template>
  <div>
    <h2 class="mb-3 text-lg font-bold text-gray-900">Omschrijving</h2>
    <!-- eslint-disable vue/no-v-html -->
    <div
      class="prose prose-sm max-w-none text-gray-700"
      v-html="sanitized"
    />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>
