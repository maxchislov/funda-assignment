<script setup lang="ts">
// Global head config, lang + title template apply to every page
useHead({
  htmlAttrs: { lang: "nl" },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Funda` : "Funda - Zoek je huis op funda";
  },
  meta: [
    { name: "description", content: "Vind je nieuwe huis op funda! Zoek in het meest complete woningaanbod van Nederland." },
  ],
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
