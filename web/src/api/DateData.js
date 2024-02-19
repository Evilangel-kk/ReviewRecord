import server from "./index.js";
export default function currMonthData(params) {
    return server({
        url: "/DateData",
        method: 'get',
        params: params
    })
}