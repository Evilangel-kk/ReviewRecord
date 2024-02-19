const mysql = require("mysql");
const IP = "localhost";
const db = mysql.createConnection({
    host: IP,
    user: "root",
    password: "123456",
    database: "record"
});
module.exports = db;