import type {LocationQuery} from "vue-router";

export default (params: LocationQuery) => {
    let query = [];

    for (let key in params)
        query.push(key + "=" + params[key]);

    return query.join("&");
}