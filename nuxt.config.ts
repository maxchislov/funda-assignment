// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-03-05",
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
    "@nuxt/icon",
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  // API key lives server-side only, never shipped to the client
  runtimeConfig: {
    fundaApiKey: process.env.FUNDA_API_KEY || "",
  },

  icon: {
    serverBundle: "local",
  },

  image: {
    domains: ["cloud.funda.nl", "img.funda.nl"],
    format: ["webp"],
    provider: "ipx",
  },

  nitro: {
    compressPublicAssets: true,
  },
});
