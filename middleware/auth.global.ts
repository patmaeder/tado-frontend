import {navigateTo} from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {

    const {isInitialized, init} = useAuth0();

    if (process.server || to.path.includes("/panel")) return

    if (!isInitialized.value) {
        let initializer = await init({
            domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
            clientId: "vDvSLgMRfXgDUhyPH6KnLIiYnmdNLDYl",
            cacheLocation: "localstorage",
            authorizationParams: {
                audience: "https://www.tado.com"
            }
        }) as { redirect_to: String };

        return navigateTo(initializer.redirect_to as string);
    }
})