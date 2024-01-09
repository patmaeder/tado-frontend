export default defineNuxtRouteMiddleware(async (to, from) => {

    const {isInitialized, context, init} = useAuth0();

    if (process.server || to.path.startsWith("/panel") || to.path.startsWith("/redirect")) return
    if (isInitialized.value && context.value == "USER") return;

    await init("USER", {
        domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
        clientId: "vDvSLgMRfXgDUhyPH6KnLIiYnmdNLDYl",
        cacheLocation: "localstorage",
        authorizationParams: {
            audience: "https://www.tado.com"
        }
    }, new URL(location.host + to.fullPath));

    delete to.query["code"];
    delete to.query["state"];
    let searchParams = "";

    let i = 0;
    for (let key in to.query) {
        searchParams += i == 0 ? "?" : "&"
        searchParams += key + "=" + to.query[key];
        i++;
    }

    return navigateTo(to.path + searchParams)
})