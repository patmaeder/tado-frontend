import {Auth0Client, type Auth0ClientOptions, createAuth0Client, User} from '@auth0/auth0-spa-js';

export const useAuth0 = () => {
    let client = useState<Auth0Client>('auth0:client');
    let isInitialized = useState<Boolean>('auth0:clientInitialized', () => false);
    let user = useState<User>('auth0:user');
    let isAuthenticated = useState<Boolean>('auth0:userIsAuthenticated');
    let accessToken = useState<String>('auth0:accessToken');

    // TODO: When error (email not verified), redirect user and display error

    const init = (config: Auth0ClientOptions, autoRedirect = false) => {
        return new Promise(async (resolve, reject) => {
            if (process.server) reject("Auth0Client can only be initialized clientside");

            client.value = await createAuth0Client(config);

            if (location.search.includes("state=") && (location.search.includes("code=") || location.search.includes("error="))) {
                await client.value.handleRedirectCallback();

                let urlSearchParams = new URLSearchParams(location.search);
                urlSearchParams.delete("state");
                urlSearchParams.delete("code");

                history.replaceState(
                    {},
                    document.title,
                    window.location.href.split('?')[0] + (urlSearchParams.size > 0 ? "?" + urlSearchParams.toString() : ""));
            }

            isAuthenticated.value = await client.value.isAuthenticated();

            if (isAuthenticated.value) {
                user.value = await client.value.getUser() as User;
                accessToken.value = await client.value.getTokenSilently();
            }

            console.log("%c🚀 Auth0Client initialized", "padding: 2px; padding-inline: 8px; background-color: green; text-color: white; border-radius: 2px");
            isInitialized.value = true;
            resolve({
                initialized: true,
                redirect_to: location.pathname.replace(location.origin, "")
            });
        })
    }

    const login = (redirectUrl: string = "") =>
        new Promise((resolve, reject) => {
            let searchParams = new URLSearchParams(location.search)
            searchParams.append("origin", location.pathname)

            console.log(searchParams.toString());

            client?.value?.loginWithRedirect({
                authorizationParams: {
                    redirect_uri: redirectUrl == "" ? location.origin + "/redirect?" + searchParams.toString() : redirectUrl,
                }
            });
        });

    const logout = (redirectUrl: string = "") =>
        new Promise((resolve, reject) => {
            let searchParams = new URLSearchParams(location.search)
            searchParams.append("origin", location.pathname)

            client?.value?.logout({
                logoutParams: {
                    returnTo: redirectUrl == "" ? location.origin + "/redirect?" + searchParams.toString() : redirectUrl,
                }
            });
        });

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