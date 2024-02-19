import server from "./index.js";
export default function ChangeRecord(params) {
    return server({
        url: "/ChangeRecord",
        method: 'post',
        params: params
    })
}