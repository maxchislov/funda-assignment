<template>
  <div class="space-y-4">
    <SkeletonBlock class="aspect-property rounded-lg" />
    <SkeletonBlock class="h-8 w-1/2" />
    <SkeletonBlock class="h-6 w-1/3" />
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <SkeletonBlock v-for="n in 6" :key="n" class="h-12" />
    </div>
  </div>
</template>
