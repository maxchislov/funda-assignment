<script setup lang="ts">
// Quick client-side guard, rejects obviously invalid IDs before hitting the API (keeps console clean)
definePageMeta({
  validate: (route) => {
    const id = route.params.id;
    return typeof id === "string" && id.length > 5 && !id.startsWith("_") && !id.includes(".");
  },
});

const route = useRoute();
const id = String(route.params.id);

const { data: listing, status, error, refresh } = useListingDetail(id);

const backTo = computed(() => {
  const params = new URLSearchParams();
  if (route.query.q) params.set("q", String(route.query.q));
  if (route.query.page) params.set("page", String(route.query.page));
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
});

useListingSeo(listing);

// Derived data stays in computed, no extra state, recalculates when listing changes
const photos = computed(() => extractPhotos(listing.value?.Media ?? null));
const specs = computed(() => (listing.value ? extractSpecs(listing.value) : []));
const hasCoordinates = computed(
  () => listing.value?.WGS84_X != null && listing.value?.WGS84_Y != null,
);
</script>

<template>
  <div>
    <NuxtLink
      :to="backTo"
      class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-funda-blue"
    >
      <Icon name="heroicons:chevron-left" class="h-4 w-4" />
      Terug naar resultaten
    </NuxtLink>

    <DetailSkeleton v-if="status === 'pending'" />

    <ErrorBox v-else-if="error" message="Kan de woning niet laden." @retry="refresh()">
      <NuxtLink :to="backTo" class="text-sm text-funda-blue hover:underline">
        Terug naar zoeken
      </NuxtLink>
    </ErrorBox>

    <template v-else-if="listing">
      <PhotoGallery v-if="photos.length" :photos="photos" />

      <div class="mt-6 grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
            {{ listing.Adres }}
          </h1>
          <p class="mt-1 text-gray-500">
            {{ listing.Postcode }} {{ listing.Plaats }}
          </p>

          <PriceTag
            :price="listing.Koopprijs"
            :abbreviation="listing.Prijs?.KoopAbbreviation"
            class="mt-4 text-2xl"
          />

          <PropertySpecs class="mt-4" :specs="specs" />

          <PropertyDescription
            v-if="listing.VolledigeOmschrijving"
            class="mt-8"
            :html="listing.VolledigeOmschrijving"
          />
        </div>

        <aside class="space-y-6">
          <AgentCard
            v-if="listing.Makelaar"
            :name="listing.Makelaar"
            :phone="listing.MakelaarTelefoon"
          />

          <div v-if="hasCoordinates" class="isolate overflow-hidden rounded-lg border border-gray-200">
            <h3 class="bg-white px-4 py-2 text-sm font-semibold text-gray-900">Locatie</h3>
            <PropertyMap
              :lat="listing.WGS84_Y!"
              :lng="listing.WGS84_X!"
              :address="listing.Adres"
            />
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>
