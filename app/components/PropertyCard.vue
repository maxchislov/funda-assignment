<script setup lang="ts">
const props = defineProps<{
  listing: ListingSummary;
  priority?: boolean;
}>()

const route = useRoute()
const imageUrl = computed(() => getListingImageUrl(props.listing))

// Preserve search context so the detail page can link back to the same results
const detailLink = computed(() => ({
  path: `/${props.listing.Id}`,
  query: {
    q: route.query.q || undefined,
    page: route.query.page || undefined,
  },
}))

const stats = computed(() => {
  const l = props.listing
  return [
    { label: "Woonoppervlakte", icon: "heroicons:arrows-pointing-out", text: l.Woonoppervlakte ? formatArea(l.Woonoppervlakte) : undefined },
    { label: "Kamers", icon: "heroicons:home", text: l.AantalKamers ? `${l.AantalKamers} kamers` : undefined },
    { label: "Perceel", icon: "heroicons:map", text: l.Perceeloppervlakte ? `${formatArea(l.Perceeloppervlakte)} perceel` : undefined },
  ].filter((s): s is typeof s & { text: string } => !!s.text)
})
</script>

<template>
  <NuxtLink
    :to="detailLink"
    class="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
  >
    <div class="relative aspect-property w-full overflow-hidden bg-gray-100">
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        :alt="`${listing.Adres}, ${listing.Woonplaats}`"
        class="h-full w-full object-cover"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'low'"
        :preload="priority"
        format="webp"
        quality="80"
        densities="1x 2x"
        sizes="xs:100vw sm:50vw lg:400px"
      />
      <div v-else class="flex h-full items-center justify-center text-gray-400">
        Geen foto
      </div>
    </div>

    <div class="p-4">
      <PriceTag
        :price="listing.Koopprijs"
        :abbreviation="listing.Prijs?.KoopAbbreviation"
        class="text-lg"
      />

      <h3 class="mt-1 text-base font-semibold text-gray-900">
        {{ listing.Adres }}
      </h3>
      <p class="text-sm text-gray-500">
        {{ listing.Postcode }} {{ listing.Woonplaats }}
      </p>

      <div v-if="stats.length" class="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
        <span v-for="stat in stats" :key="stat.label" class="flex items-center gap-1">
          <Icon :name="stat.icon" class="h-4 w-4" />
          {{ stat.text }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
