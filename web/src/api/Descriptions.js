import server from "./index.js";
export default function Descriptions(params) {
    return server({
        url: "/Descriptions",
        method: 'get',
        params: params
    })
}