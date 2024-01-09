import {Auth0Client, type Auth0ClientOptions, createAuth0Client, User} from '@auth0/auth0-spa-js';

export const useAuth0 = () => {
    const {showNotification} = useToastNotifications();
    let client = useState<Auth0Client>('auth0:client');
    let isInitialized = useState<Boolean>('auth0:clientInitialized', () => false);
    let context = useState<String>('auth0:context', () => '');
    let user = useState<User>('auth0:user');
    let isAuthenticated = useState<Boolean>('auth0:userIsAuthenticated');
    let accessToken = useState<String>('auth0:accessToken');

    const init = (id: String, config: Auth0ClientOptions, url: URL) => {
        return new Promise(async (resolve, reject) => {
            if (process.server) reject("Auth0Client can only be initialized clientside");

            client.value = await createAuth0Client(config);

            if (url.search.includes("state=") && (url.search.includes("code=") || url.search.includes("error="))) {
                await client.value.handleRedirectCallback();
            }

            isAuthenticated.value = await client.value.isAuthenticated();

            if (isAuthenticated.value) {
                user.value = await client.value.getUser() as User;
                accessToken.value = await client.value.getTokenSilently();
            }

            console.log("%c🚀 Auth0Client initialized", "padding: 2px; padding-inline: 8px; background-color: green; text-color: white; border-radius: 2px");
            context.value = id;
            isInitialized.value = true;
            resolve(true);
        })
    }

    const login = (redirectPath: string = "") =>
        new Promise((resolve, reject) => {
            let searchParams = new URLSearchParams(location.search)
            searchParams.append("origin", !(typeof redirectPath == "string") || redirectPath == "" ? location.pathname : redirectPath)

            client?.value?.loginWithRedirect({
                authorizationParams: {
                    redirect_uri: location.origin + "/redirect?" + searchParams.toString(),
                }
            });
        });

    const logout = (redirectPath: string = "") =>
        new Promise((resolve, reject) => {
            let searchParams = new URLSearchParams(location.search)
            searchParams.append("origin", !(typeof redirectPath == "string") || redirectPath == "" ? location.pathname : redirectPath)

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