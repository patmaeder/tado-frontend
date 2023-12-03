import {type NitroFetchOptions} from "nitropack";

export default class Tado {

    private static apiUrl = "http://localhost:8080"

    static getBoards() {
        return this.fetchTado("/boards");
    }

    static getBoard(boardId: String) {
        return this.fetchTado("/boards/" + boardId);
    }

    static createBoard(boardDTO: BoardDTO) {
        return this.fetchTado("/boards", {method: "POST", body: boardDTO});
    }

    static updateBoard(boardId: string, boardDTO: BoardDTO) {
        return this.fetchTado("/boards/" + boardId, {method: "PATCH", body: boardDTO});
    }

    static deleteBoard(boardId: string) {
        return this.fetchTado("/boards/" + boardId, {method: "DELETE"});
    }

    static getSuggestions(boardId: String) {
        return this.fetchTado("/boards/" + boardId + "/suggestions");
    }

    static getSuggestion(suggestionId: String) {
        return this.fetchTado("/suggestions/" + suggestionId);
    }

    static createSuggestion(suggestionDTO: SuggestionDTO) {
        return this.fetchTado("/suggestions", {method: "POST", body: suggestionDTO});
    }

    static updateSuggestion(suggestionId, suggestionDTO: suggestionDTO) {
        return this.fetchTado("/suggestions/" + suggestionId, {method: "PATCH", body: suggestionDTO});
    }

    static deleteSuggestion(suggestionId) {
        return this.fetchTado("/suggestions/" + suggestionId, {method: "DELETE"});
    }

    static getComments(suggestionId: String) {
        return this.fetchTado("/suggestions/" + suggestionId + "/comments")
    }


    private static fetchTado(path: String, opts: NitroFetchOptions<string> = {}) {
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

        return useFetch(this.apiUrl + path, opts);
    }
}