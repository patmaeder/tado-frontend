export default defineNuxtRouteMiddleware(async (to, from) => {

    const {isInitialized, context, init} = useAuth0();

    if (process.server) return
    if (to.path == "/" || to.path.startsWith("/panel") || to.path.startsWith("/redirect")) return
    if (isInitialized.value && context.value == "USER") return;

    const redirectUrl = await init("USER", {
        domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
        clientId: "vDvSLgMRfXgDUhyPH6KnLIiYnmdNLDYl",
        cacheLocation: "localstorage",
        authorizationParams: {
            audience: "https://www.tado.com"
        }
    }, to.fullPath) as string;

    return navigateTo(redirectUrl)
})