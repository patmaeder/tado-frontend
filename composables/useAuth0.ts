import {Auth0Client, createAuth0Client, User} from '@auth0/auth0-spa-js';
import {useState} from "#app";

export const useAuth0 = () => {
    let auth0Client = useState<Auth0Client>('auth0Client');
    let auth0ClientInitialized = useState<Boolean>('auth0ClientInitiated');
    let isAuthenticated = useState<Boolean>('tenantIsAuthenticated');
    let tenant = useState<User | undefined>('tenant');
    let accessToken = useState<String | undefined>('accessToken');

    const init = async () => {
        const client = await createAuth0Client({
            domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
            clientId: "kSmyKUQNRkiRv43tpC22TyU9iRPfa3ym",
            authorizationParams: {
                redirect_uri: "http://localhost:3000/panel",
                audience: "https://www.tado.com"
            }
        })

        if (auth0Client.value != undefined) return;

        auth0Client.value = client;

        if (location.search.includes("state=") && (location.search.includes("code=") || location.search.includes("error="))) {
            await auth0Client.value.handleRedirectCallback();
            window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
        }

        isAuthenticated.value = await auth0Client.value.isAuthenticated();

        if (isAuthenticated.value) {
            tenant.value = await auth0Client.value.getUser();
            accessToken.value = await auth0Client.value.getTokenSilently();
        } else {
            login();
        }

        auth0ClientInitialized.value = true;
        console.log("%c🚀 Auth0Client initiated", "padding: 2px; padding-inline: 8px; background-color: green; text-color: white; border-radius: 2px");
    }

    const untilAuth0Initialized = () => {
        return new Promise((resolve, reject) => {
            watch(auth0ClientInitialized, () => {
                if (auth0ClientInitialized.value) resolve(true);
            })
        })
    }

    const login = () => {
        auth0Client.value.loginWithRedirect();
    }

    const logout = () => {
        auth0Client.value.logout({
            logoutParams: {
                returnTo: "http://localhost:3000"
            }
        })
    }

    // Init Auth0Client client-side
    if (process.client && auth0Client.value == undefined) init()

    return {
        init,
        auth0ClientInitialized,
        untilAuth0Initialized,
        login,
        logout,
        tenant,
        isAuthenticated,
        accessToken
    }
}