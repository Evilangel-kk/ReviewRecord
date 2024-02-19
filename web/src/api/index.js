const IP = "http://127.0.0.1:3008";
import axios from 'axios'
//对axios进行二次封装
const server = axios.create({
    // 发送请求时都带上/api
    baseURL: IP + '/api',
    // 5 秒内无反应则自动请求失败
    timeout: 5000,
    headers: {
        // 为了不进行预处理请求需要用这种格式的数据
        "Content-Type": "application/x-www-form-urlencoded"
    }
});

//请求拦截器，在发送请求之前可以检测到，可以在请求发出去之前做一些事情
server.interceptors.request.use((config) => {
    //config: 配置对象，对象里面有一个属性很重要 headers 请求头
    return config;
});

//响应拦截器
server.interceptors.response.use((res) => {
    //成功的回调函数：服务器响应数据回来后，响应可以检测到，可以做一些事情
    return res.data;
}, (error) => {
    //失败的回调函数
    return Promise.reject(new Error('faile'));
})

export default server;