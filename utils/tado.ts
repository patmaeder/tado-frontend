import type {AsyncData, UseFetchOptions} from "#app";
import {FetchError} from "ofetch";

export default class Tado {

    static apiUrl: undefined | string = undefined;

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

    static getCategories(boardId: String) {
        return this.fetchTado<Category[]>("/boards/" + boardId + "/categories");
    }

    private static fetchTado<T>(path: String, opts: UseFetchOptions<string> = {}) {
        const {isAuthenticated, accessToken} = useAuth0();

        if (this.apiUrl == undefined) {
            throw createError({
                statusCode: 400,
                fatal: true,
                statusMessage: 'Defective server configuration. This problem won\'t be resolved by reloading the page. We apologize for the inconvenience.',
            })
        }

        if (!opts.headers) opts.headers = {};
        if (isAuthenticated.value) { // @ts-ignore
            opts.headers.Authorization = 'Bearer ' + accessToken.value;
        }

        opts.headers = {
            ...opts.headers,
            'Access-Control-Allow-Origin': '*',
        }

        return useFetch(this.apiUrl + path, opts) as AsyncData<T, FetchError<any> | null>;
    }
}