import {type NitroFetchOptions} from "nitropack";

export default class Tado {

    private static apiUrl = "http://localhost:8080"

    static getBoards() {
        return this.fetchTado("boards", "/boards");
    }

    static getBoard(boardId: String) {
        return this.fetchTado("board:" + boardId, "/boards/" + boardId);
    }

    private static fetchTado(identifier: string, path: String, opts: NitroFetchOptions<string> = {}) {
        const {isAuthenticated, accessToken} = useAuth0();

        // TODO: Throw error if unauthenticated
        // if (isAuthenticated.value == undefined) reject("User is not authenticated");

        if (opts == undefined) opts = {};
        if (!opts.headers) opts['headers'] = {} as HeadersInit;
        opts.headers = {
            ...opts.headers,
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + accessToken.value
        }

        const {data, pending} = useLazyAsyncData(
            identifier,
            () => $fetch(this.apiUrl + path, opts)
        );

        console.log(pending);

        return {data, pending};
    }
}