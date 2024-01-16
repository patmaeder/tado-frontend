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

            client.value = await createAuth0Client(config);
            let loginResult = null;

            if ((path.includes("state=") && path.includes("code=")) || path.includes("error")) {
                try {
                    loginResult = await client.value.handleRedirectCallback();
                } catch (e) {
                    reject(e)
                }
            }

            isAuthenticated.value = await client.value.isAuthenticated();
            if (isAuthenticated.value) {
                user.value = await client.value.getUser() as User;
                accessToken.value = await client.value.getTokenSilently();
            }

            context.value = id;
            isInitialized.value = true;
            console.log("%c🚀 Auth0Client initialized", "padding: 2px; padding-inline: 8px; background-color: green; text-color: white; border-radius: 2px");

            resolve(loginResult)
        })
    }

    const login = (appState: string, redirectPath: string) =>
        new Promise((resolve, reject) => {
            client?.value?.loginWithRedirect({
                appState,
                authorizationParams: {
                    redirect_uri: location.origin + redirectPath,
                }
            });
        });

    const logout = (redirectPath: string) =>
        new Promise((resolve, reject) => {
            client?.value?.logout({
                logoutParams: {
                    returnTo: location.origin + redirectPath,
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