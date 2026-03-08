<script setup lang="ts">
import type { GalleryPhoto } from "~/utils/listing"

// Main image dimensions (16:10, matches aspect-property); sizes hints for responsive srcset
const GALLERY_IMAGE_WIDTH = 922
const GALLERY_IMAGE_HEIGHT = 576

// Thumbnail strip: display size w-24 (96px) / sm:w-28 (112px); dimensions for aspect + srcset
const THUMBNAIL_IMAGE_WIDTH = 121
const THUMBNAIL_IMAGE_HEIGHT = 80

const props = defineProps<{
  photos: GalleryPhoto[];
}>()

const { activeIndex, next, prev, goTo, onKeydown } = useCarousel(
  computed(() => props.photos.length),
)
const activePhoto = computed(() => props.photos[activeIndex.value])
const hasMultiple = computed(() => props.photos.length > 1)

const navButtons = [
  { action: prev, side: "left-3", label: "Vorige foto", icon: "heroicons:chevron-left" },
  { action: next, side: "right-3", label: "Volgende foto", icon: "heroicons:chevron-right" },
] as const
</script>

<template>
  <!-- ARIA carousel pattern: focusable region + arrow-key navigation for keyboard users -->
  <section
    v-if="photos.length"
    role="region"
    aria-roledescription="carousel"
    aria-label="Foto's van de woning"
    tabindex="0"
    class="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-funda-orange/40"
    @keydown="onKeydown"
  >
    <figure class="relative overflow-hidden rounded-t-lg bg-gray-100">
      <NuxtImg
        v-if="activePhoto"
        :src="activePhoto.url"
        :alt="activePhoto.alt || 'Foto'"
        class="aspect-property w-full object-cover"
        :width="GALLERY_IMAGE_WIDTH"
        :height="GALLERY_IMAGE_HEIGHT"
      />

      <button
        v-for="btn in hasMultiple ? navButtons : []"
        :key="btn.label"
        :aria-label="btn.label"
        :class="btn.side"
        class="absolute top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
        tabindex="-1"
        @click="btn.action"
      >
        <Icon :name="btn.icon" class="h-5 w-5" />
      </button>

      <p
        aria-live="polite"
        aria-atomic="true"
        class="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white"
      >
        {{ activeIndex + 1 }} / {{ photos.length }}
      </p>
    </figure>

    <div
      v-if="hasMultiple"
      role="tablist"
      aria-label="Kies een foto"
      class="mt-2 flex gap-2 overflow-x-auto rounded-b-lg pb-2 scrollbar-thin"
    >
      <button
        v-for="(photo, i) in photos"
        :key="photo.url"
        role="tab"
        :aria-selected="i === activeIndex"
        :aria-label="`Foto ${i + 1} van ${photos.length}`"
        class="flex-none"
        tabindex="-1"
        @click="goTo(i)"
      >
        <NuxtImg
          :src="photo.url"
          :alt="photo.alt || `Foto ${i + 1}`"
          class="h-16 w-24 rounded border-2 object-cover transition-all sm:h-20 sm:w-28"
          :class="i === activeIndex ? 'border-funda-orange' : 'border-transparent opacity-60 hover:opacity-100'"
          loading="lazy"
          :width="THUMBNAIL_IMAGE_WIDTH"
          :height="THUMBNAIL_IMAGE_HEIGHT"
        />
      </button>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
}
</style>
