import type {Ref} from "vue";
import {useFetch, type UseFetchOptions} from "#app";
import {type NitroFetchRequest} from "nitropack";

export const useTado = () => {
    const {untilAuth0Initialized, accessToken} = useAuth0();
    const apiUrl = "http://localhost:8080"

    const fetch = async (
        req: NitroFetchRequest | Ref<NitroFetchRequest> | (() => NitroFetchRequest),
        opts?: UseFetchOptions<any> | undefined) => {

        if (!accessToken.value) await untilAuth0Initialized();
        if (opts == undefined) opts = {};
        if (!opts.headers) opts['headers'] = {} as HeadersInit;
        opts.headers = {
            ...opts.headers,
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + accessToken.value
        }
        return useFetch(req, opts);
    }

    const getBoard = async (id: String): Promise<Ref<Board>> => {
        if (id != undefined) {
            const board = await fetch(apiUrl + "/boards/" + id);
            return board.data as Ref<Board>;
        }
        return null;
    }
    const getBoards = async (): Promise<Ref<Board[]>> => {
        const boards = await fetch(apiUrl + "/boards");
        return boards.data as Ref<Board[]>;
    }

    const createBoard = async (config: BoardDTO): Promise<Ref<Board>> => {
        const board = await fetch(apiUrl + "/boards", {method: 'POST', body: config});
        return board.data as Ref<Board>;
    }

    return {
        getBoards,
        getBoard,
        createBoard
    }
}