export default defineNuxtPlugin(nuxtApp => {
    tado.apiUrl = useRuntimeConfig().public.serverUrl;
})