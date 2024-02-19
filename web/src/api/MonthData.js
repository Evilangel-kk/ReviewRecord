import server from "./index.js";
export default function MonthData(params) {
    return server({
        url: "/MonthData",
        method: 'get',
        params: params
    })
}