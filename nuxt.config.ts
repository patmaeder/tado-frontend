// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true,

        timeline: {
            enabled: true
        }
    },
    modules: ['@nuxtjs/tailwindcss'],
    tailwindcss: {
        exposeConfig: true,
        viewer: true,
    },
    routeRules: {
        '/panel/**': {ssr: false}
    },
    runtimeConfig: {
        public: {
            serverUrl: process.env.SERVER_URL
        }
    }
})