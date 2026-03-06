<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    initialQuery?: string;
  }>(),
  { initialQuery: "" },
)

const emit = defineEmits<{
  search: [query: string];
}>()

const searchInput = ref(props.initialQuery)

watch(() => props.initialQuery, (v) => {
  searchInput.value = v
})

function onSubmit() {
  emit("search", searchInput.value.trim())
}
</script>

<template>
  <form role="search" class="flex gap-2" @submit.prevent="onSubmit">
    <input
      v-model="searchInput"
      type="search"
      placeholder="Zoek op plaats, bijv. Amsterdam"
      aria-label="Zoek op plaats"
      class="flex-1 rounded-lg border border-gray-300 px-4 py-4 text-sm transition-colors focus:border-funda-orange focus:outline-none focus:ring-2 focus:ring-funda-orange/20"
    >
    <button
      type="submit"
      class="rounded-lg bg-funda-orange px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-orange-500"
    >
      Zoeken
    </button>
  </form>
</template>
