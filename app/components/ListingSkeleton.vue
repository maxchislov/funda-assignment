<script setup lang="ts">
defineProps<{
  count?: number;
}>()
</script>

<template>
  <PropertyGrid>
    <div
      v-for="n in (count ?? 6)"
      :key="n"
      class="overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <SkeletonBlock class="aspect-property rounded-none" />
      <div class="space-y-2 p-4">
        <SkeletonBlock class="h-5 w-1/3" />
        <SkeletonBlock class="h-4 w-2/3" />
        <SkeletonBlock class="h-4 w-1/2" />
      </div>
    </div>
  </PropertyGrid>
</template>
