import {Auth0Client, type Auth0ClientOptions, createAuth0Client, User} from '@auth0/auth0-spa-js';

export const useAuth0 = () => {
    let client = useState<Auth0Client>('auth0:client');
    let isInitialized = useState<Boolean>('auth0:clientInitialized', () => false);
    let context = useState<String>('auth0:context', () => '');
    let user = useState<User>('auth0:user');
    let isAuthenticated = useState<Boolean>('auth0:userIsAuthenticated');
    let accessToken = useState<String>('auth0:accessToken');

    const init = (id: String, config: Auth0ClientOptions, path: string) => {
        return new Promise(async (resolve, reject) => {
            if (process.server) reject("Auth0Client can only be initialized clientside");

            let base = path.includes("?") ? path.substring(0, path.indexOf("?")) : path;
            const searchParams = new URLSearchParams(path.includes("?") ? path.substring(path.indexOf("?")) : "")

            client.value = await createAuth0Client(config);

            if ((searchParams.get("state") && searchParams.get("state")) || searchParams.get("error")) {
                try {
                    await client.value.handleRedirectCallback();
                } catch (e) {
                    reject(e)
                }

                searchParams.delete("code");
                searchParams.delete("state");
            }

            isAuthenticated.value = await client.value.isAuthenticated();
            if (isAuthenticated.value) {
                user.value = await client.value.getUser() as User;
                accessToken.value = await client.value.getTokenSilently();
            }

            context.value = id;
            isInitialized.value = true;
            console.log("%c🚀 Auth0Client initialized", "padding: 2px; padding-inline: 8px; background-color: green; text-color: white; border-radius: 2px");

            if (searchParams.size > 0) base += "?"
            resolve(base + searchParams.toString())
        })
    }

    const login = (redirectPath?: string) =>
        new Promise((resolve, reject) => {
            let searchParams: URLSearchParams;
            if (redirectPath != undefined && typeof redirectPath == "string") {
                const base = redirectPath.includes("?") ? redirectPath.substring(0, redirectPath.indexOf("?")) : redirectPath;
                searchParams = new URLSearchParams(redirectPath.includes("?") ? redirectPath.substring(redirectPath.indexOf("?")) : "")
                searchParams.append("origin", base);
            } else {
                searchParams = new URLSearchParams(location.search)
                searchParams.append("origin", location.pathname);
            }

            client?.value?.loginWithRedirect({
                authorizationParams: {
                    redirect_uri: location.origin + "/redirect?" + searchParams.toString(),
                }
            });
        });

    const logout = (redirectPath?: string) =>
        new Promise((resolve, reject) => {
            let searchParams: URLSearchParams;
            if (redirectPath != undefined && typeof redirectPath == "string") {
                const base = redirectPath.includes("?") ? redirectPath.substring(0, redirectPath.indexOf("?")) : redirectPath;
                searchParams = new URLSearchParams(redirectPath.includes("?") ? redirectPath.substring(redirectPath.indexOf("?")) : "")
                searchParams.append("origin", base);
            } else {
                searchParams = new URLSearchParams(location.search)
                searchParams.append("origin", location.pathname);
            }

            client?.value?.logout({
                logoutParams: {
                    returnTo: location.origin + "/redirect?" + searchParams.toString(),
                }
            });
        });

    return {
        init,
        isInitialized,
        context,
        login,
        logout,
        user,
        isAuthenticated,
        accessToken
    }
}