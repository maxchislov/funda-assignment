<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number];
}>()

function goTo(page: number) {
  emit("update:currentPage", page)
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2"
    aria-label="Paginering"
  >
    <button
      :disabled="currentPage <= 1"
      class="rounded-lg border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      aria-label="Ga naar de vorige pagina"
      @click="goTo(currentPage - 1)"
    >
      Vorige
    </button>

    <span class="px-3 py-2 text-sm text-gray-600" aria-live="polite">
      Pagina {{ currentPage }} van {{ totalPages }}
    </span>

    <button
      :disabled="currentPage >= totalPages"
      class="rounded-lg border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      aria-label="Ga naar de volgende pagina"
      @click="goTo(currentPage + 1)"
    >
      Volgende
    </button>
  </nav>
</template>
