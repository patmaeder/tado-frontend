import {Auth0Client, createAuth0Client, User} from '@auth0/auth0-spa-js';
import {useState} from "#app";

export const useAuth0 = () => {
    let auth0Client = useState<Auth0Client>('auth0Client');
    let auth0ClientInitialized = useState<Boolean>('auth0ClientInitiated');
    let tenant= useState<User|undefined>('tenant');
    let isAuthenticated = useState<Boolean>('tenantIsAuthenticated');

    const init = async () => {
        auth0Client.value = await createAuth0Client({
            domain: "dev-d62xibfl4x3znv4i.us.auth0.com",
            clientId: "kSmyKUQNRkiRv43tpC22TyU9iRPfa3ym",
        })

        if (location.search.includes("state=") && (location.search.includes("code=") || location.search.includes("error="))) {
            await auth0Client.value.handleRedirectCallback();
            window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
        }

        auth0ClientInitialized.value = true;
        isAuthenticated.value = await auth0Client.value.isAuthenticated();
        if (isAuthenticated) tenant.value = await auth0Client.value.getUser();
        console.log("%c🚀 Auth0Client initiated", "padding: 2px; padding-inline: 8px; background-color: green; text-color: white; border-radius: 2px");
    }

    const login = () => {
        auth0Client.value.loginWithRedirect({
            authorizationParams: {
                redirect_uri: "http://localhost:3000/panel",
                audience: "https://www.tado.com"
            }
        });
    }

    const logout = () => {
        auth0Client.value.logout({
            logoutParams: {
                returnTo: "http://localhost:3000"
            }
        })
    }

    return {
        init,
        auth0ClientInitialized,
        login,
        logout,
        tenant,
        isAuthenticated,
    }
}