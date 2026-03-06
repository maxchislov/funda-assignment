<script setup lang="ts">
// .client.vue suffix = Nuxt only renders this on the CLIENT!!
// Leaflet needs `window`, so we skip SSR entirely instead of shimming globals.
import type { Map as LeafletMap } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const props = defineProps<{
  lat: number;
  lng: number;
  address?: string;
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
const loadError = ref(false);
const loading = ref(true);
let mapInstance: LeafletMap | null = null;

onMounted(async () => {
  try {
    const L = await import("leaflet");
    await import("leaflet/dist/leaflet.css");

    if (!mapContainer.value) return;

    const map = L.map(mapContainer.value).setView([props.lat, props.lng], 15);
    mapInstance = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Webpack/Vite breaks Leaflet's default icon paths, so we wire them up manually
    const icon = L.icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const marker = L.marker([props.lat, props.lng], { icon }).addTo(map);
    if (props.address) {
      const el = document.createElement("strong");
      el.textContent = props.address;
      marker.bindPopup(el).openPopup();
    }
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  mapInstance?.remove();
  mapInstance = null;
});
</script>

<template>
  <div class="relative h-[300px] w-full rounded-lg sm:h-[400px]">
    <div ref="mapContainer" class="h-full w-full" />
    <div
      v-if="loading || loadError"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 text-sm"
      :class="loadError ? 'text-red-500' : 'text-gray-400'"
    >
      {{ loadError ? "Kaart kon niet geladen worden" : "Kaart laden…" }}
    </div>
  </div>
</template>
