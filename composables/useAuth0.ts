import {Auth0Client, type Auth0ClientOptions, createAuth0Client, User} from '@auth0/auth0-spa-js';

export const useAuth0 = () => {
    let auth0Client = ref<Auth0Client>();
    let user = ref<User | undefined>();
    let isAuthenticated = ref<Boolean>();
    let accessToken = ref<String | undefined>();

    const init = (config: Auth0ClientOptions) => {

        return new Promise(async (resolve, reject) => {
            if (process.server) reject("Auth0Client can only be initialized clientside");

            auth0Client.value = await createAuth0Client(config);
            if (location.search.includes("state=") && (location.search.includes("code=") || location.search.includes("error="))) {
                await auth0Client.value.handleRedirectCallback();
                window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
            }

            isAuthenticated.value = await auth0Client.value.isAuthenticated();
            if (isAuthenticated.value) {
                user.value = await auth0Client.value.getUser();
                accessToken.value = await auth0Client.value.getTokenSilently();
            }

            console.log("%c🚀 Auth0Client initiated", "padding: 2px; padding-inline: 8px; background-color: green; text-color: white; border-radius: 2px");
            resolve(true);
        })
    }

    const login = () => {
        auth0Client?.value?.loginWithRedirect();
    }

    const loginWithPopup = () => {
        auth0Client?.value?.loginWithPopup();
    }

    const logout = (redirectUrl: string) => {
        auth0Client?.value?.logout({
            logoutParams: {
                returnTo: redirectUrl
            }
        })
    }

    return {
        init,
        login,
        loginWithPopup,
        logout,
        user,
        isAuthenticated,
        accessToken
    }
}