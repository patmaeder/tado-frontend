import {type NitroFetchOptions} from "nitropack";
import type {AsyncData} from "#app";
import {FetchError} from "ofetch";

export default class Tado {

    private static apiUrl = "http://localhost:8080"

    static getBoards() {
        return this.fetchTado<Board[]>("/boards");
    }

    static getBoard(boardId: String) {
        return this.fetchTado<Board>("/boards/" + boardId);
    }

    static createBoard(boardDTO: BoardDTO) {
        return this.fetchTado<Board>("/boards", {method: "POST", body: boardDTO});
    }

    static updateBoard(boardId: string, boardDTO: BoardDTO) {
        return this.fetchTado<Board>("/boards/" + boardId, {method: "PATCH", body: boardDTO});
    }

    static deleteBoard(boardId: string) {
        return this.fetchTado<void>("/boards/" + boardId, {method: "DELETE"});
    }

    static getSuggestions(boardId: String) {
        return this.fetchTado<Suggestion[]>("/boards/" + boardId + "/suggestions");
    }

    static getSuggestion(suggestionId: String) {
        return this.fetchTado<Suggestion>("/suggestions/" + suggestionId);
    }

    static createSuggestion(suggestionDTO: SuggestionDTO) {
        return this.fetchTado<Suggestion>("/suggestions", {method: "POST", body: suggestionDTO});
    }

    static updateSuggestion(suggestionId: String, suggestionDTO: SuggestionDTO) {
        return this.fetchTado<Suggestion>("/suggestions/" + suggestionId, {method: "PATCH", body: suggestionDTO});
    }

    static deleteSuggestion(suggestionId: String) {
        return this.fetchTado<void>("/suggestions/" + suggestionId, {method: "DELETE"});
    }

    static getComments(suggestionId: String) {
        return this.fetchTado<Comment[]>("/suggestions/" + suggestionId + "/comments")
    }

    static createComment(commentDTO: CommentDTO) {
        return this.fetchTado<Comment>("/comments", {method: "POST", body: commentDTO})
    }

    private static fetchTado<T>(path: String, opts: NitroFetchOptions<string> = {}) {
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

        return useFetch(this.apiUrl + path, opts) as AsyncData<T, FetchError<any> | null>;
    }
}