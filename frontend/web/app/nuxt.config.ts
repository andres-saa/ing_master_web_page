// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/icon', '@nuxt/fonts'],
  css: ['~/assets/base.css'],
  fonts: {
    families: [
      // pesos y estilos que vas a usar
      { name: 'Roboto', weights: [400,500,700,900], styles: ['normal','italic'] }
    ],

  }
})
