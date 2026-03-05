// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-03-05",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  runtimeConfig: {
    fundaApiKey: process.env.FUNDA_API_KEY || "",
  },

  image: {
    domains: ["cloud.funda.nl", "img.funda.nl"], // Allow Funda's CDNs
  },
});
