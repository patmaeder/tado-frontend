import {Auth0Client, type Auth0ClientOptions, createAuth0Client, User} from '@auth0/auth0-spa-js';

export const useAuth0 = () => {
    let client = useState<Auth0Client>('auth0:client');
    let isInitialized = useState<Boolean>('auth0:clientInitialized', () => false);
    let user = useState<User>('auth0:user');
    let isAuthenticated = useState<Boolean>('auth0:userIsAuthenticated');
    let accessToken = useState<String>('auth0:accessToken');

    const init = (config: Auth0ClientOptions, autoRedirect = false) => {
        return new Promise(async (resolve, reject) => {
            if (process.server) reject("Auth0Client can only be initialized clientside");

            client.value = await createAuth0Client(config);

            if (location.search.includes("state=") && (location.search.includes("code=") || location.search.includes("error="))) {
                await client.value.handleRedirectCallback();
                window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
            }

            isAuthenticated.value = await client.value.isAuthenticated();

            user.value = await client.value.getUser();
            if (isAuthenticated.value) {
                accessToken.value = await client.value.getTokenSilently();
            }

            console.log("%c🚀 Auth0Client initialized", "padding: 2px; padding-inline: 8px; background-color: green; text-color: white; border-radius: 2px");
            isInitialized.value = true;
            resolve(true);
        })
    }

    const login = () =>
        new Promise((resolve, reject) => {
            client?.value?.loginWithRedirect();
        })

    const logout = (redirectUrl: string) =>
        client?.value?.logout({
            logoutParams: {
                returnTo: redirectUrl
            }
        })

    return {
        init,
        isInitialized,
        login,
        logout,
        user,
        isAuthenticated,
        accessToken
    }
}