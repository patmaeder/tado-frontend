import type {RedirectLoginResult} from "@auth0/auth0-spa-js";

export default defineNuxtRouteMiddleware(async (to, from) => {

    const {isInitialized, context, init, isAuthenticated, login, logout, accessToken} = useAuth0();

    if (process.server) return
    if (!to.path.startsWith("/panel")) return
    if (isInitialized.value && context.value == "TENANT") return

    try {
        const loginResult = await init("TENANT", {
            domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
            clientId: "kSmyKUQNRkiRv43tpC22TyU9iRPfa3ym",
            cacheLocation: "localstorage",
            authorizationParams: {
                audience: "https://www.tado.com"
            }
        }, to.fullPath) as RedirectLoginResult;

        if (!isAuthenticated.value) {
            await login(to.fullPath, "/panel");
            return abortNavigation();
        }
        
        if (loginResult != null) return navigateTo(loginResult.appState)

    } catch (e) {
        await logout("/?notification=Login failed. Please make sure that your e-mail is verified. If the error persists, the service may be temporarily unavailable.");
        return abortNavigation();
    }
})
