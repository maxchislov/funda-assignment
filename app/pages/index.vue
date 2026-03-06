<script setup lang="ts">
useHead({
  title: "Woningen te koop — Funda",
  meta: [
    { name: "description", content: "Bekijk alle woningen die te koop staan op funda. Zoek in het meest actuele aanbod van huizen, appartementen en nieuwbouw in Nederland." },
  ],
})

const route = useRoute()
const router = useRouter()

// URL is the single source of truth for search state, keeps results shareable/bookmarkable
const currentPage = computed({
  get: () => Number(route.query.page) || 1,
  set: (v) => router.push({ query: { ...route.query, page: v > 1 ? v : undefined } }),
})

const searchLocation = computed({
  get: () => String(route.query.q ?? ""),
  set: (v) => router.push({ query: { ...route.query, q: v || undefined, page: undefined } }),
})

const { data, status, error, refresh } = useListings({
  page: currentPage,
  location: searchLocation,
})

function onSearch(query: string) {
  searchLocation.value = query
}

function onPageChange(page: number) {
  currentPage.value = page
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}
</script>

<template>
  <div>
    <SearchBar class="mb-6" :initial-query="searchLocation" @search="onSearch" />

    <!-- 
      AppShell Architecture: This skeleton loader ensures the UI layout remains completely 
      stable without Cumulative Layout Shift (CLS) while useFetch resolves the data.
    -->
    <ListingSkeleton v-if="status === 'pending'" />

    <ErrorBox v-else-if="error" message="Er ging iets mis bij het ophalen van woningen." @retry="refresh()">
      Opnieuw proberen
    </ErrorBox>

    <template v-else-if="data">
      <p class="mb-4 text-sm text-gray-500">
        {{ data.TotaalAantalObjecten.toLocaleString("nl-NL") }} woningen gevonden
      </p>

      <PropertyGrid v-if="data.Objects.length">
        <PropertyCard
          v-for="(listing, index) in data.Objects"
          :key="listing.Id"
          :listing="listing"
          :priority="index <= 2"
        />
      </PropertyGrid>

      <p v-else class="py-12 text-center text-gray-500">
        Geen woningen gevonden. Probeer een andere zoekterm.
      </p>

      <PaginationBar
        class="mt-8"
        :current-page="currentPage"
        :total-pages="data.Paging.AantalPaginas"
        @update:current-page="onPageChange"
      />
    </template>
  </div>
</template>
