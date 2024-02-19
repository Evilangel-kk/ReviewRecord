const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const router = require("./user/index");
app.use('/api', router);
app.listen(3008, () => {
    console.log("服务器启动: http://localhost:3008");
})