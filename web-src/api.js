import _ from "lodash";

export default async function(path, params, options){
    if(!options) options = {};

    let method = _.get(options, "method", "POST").toUpperCase(); 

    let fetch_response = await window.fetch("/api" + path, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: method != "GET" && method != "HEAD" ? JSON.stringify(params) : undefined,
    });

    if(!fetch_response.ok){
        let errmsg = await fetch_response.text();
        throw Error(errmsg);
    } else {
        return await fetch_response.json();
    }
}