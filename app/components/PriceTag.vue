<script setup lang="ts">
defineProps<{
  price: number | null | undefined;
  abbreviation?: string | null;
}>();
</script>

<template>
  <p class="font-bold text-funda-orange">
    {{ formatPrice(price) }}
    <span v-if="abbreviation" class="text-[0.75em] font-normal text-gray-500">
      {{ abbreviation }}
    </span>
  </p>
</template>
