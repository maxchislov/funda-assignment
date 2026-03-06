<script setup lang="ts">
</script>

<template>
  <!-- 
    AppShell Architecture: This layout forms the static "Shell" of the application. 
    It is instantly rendered and cached, providing immediate visual feedback (Header/Footer) 
    while the dynamic <slot /> handles the heavy page-level data fetching.
  -->
  <div class="flex min-h-screen flex-col bg-gray-50">
    <header class="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <NuxtLink to="/" aria-label="Funda Home" class="flex items-center gap-2 text-3xl font-bold text-funda-orange">
          funda
        </NuxtLink>
      </nav>
    </header>

    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <slot />
    </main>

    <footer class="border-t border-gray-200 bg-white">
      <div class="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6">
        &copy; 2026 Funda Assignment &dash; Built with Nuxt 3
      </div>
    </footer>
  </div>
</template>
