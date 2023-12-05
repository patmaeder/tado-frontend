export default defineNuxtRouteMiddleware(async (to, from) => {

    const {isInitialized, init, isAuthenticated, login} = useAuth0();

    if (to.path.startsWith("/panel")) {
        if (!isInitialized.value) {
            await init({
                domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
                clientId: "kSmyKUQNRkiRv43tpC22TyU9iRPfa3ym",
                authorizationParams: {
                    audience: "https://www.tado.com"
                }
            });
            if (!isAuthenticated.value) {
                await login({
                    authorizationParams: {
                        redirect_uri: "http://localhost:3000/redirect?origin=" + to.path,
                    }
                });
                return abortNavigation();
            }
            return navigateTo(to.path);
        }
    }
})