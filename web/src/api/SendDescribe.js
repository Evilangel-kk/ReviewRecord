import server from "./index.js";
export default function SendDescribe(params) {
    return server({
        url: "/SendDescribe",
        method: 'post',
        params: params
    })
}