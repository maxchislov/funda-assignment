<script setup lang="ts">
defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  retry: [];
}>();

// Only show the retry button when the parent actually listens for @retry
const hasRetry = computed(() => !!getCurrentInstance()?.vnode.props?.onRetry);
</script>

<template>
  <div class="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
    <p class="text-red-700">{{ message }}</p>
    <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
      <button
        v-if="hasRetry"
        class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        @click="emit('retry')"
      >
        Opnieuw proberen
      </button>
      <slot />
    </div>
  </div>
</template>
