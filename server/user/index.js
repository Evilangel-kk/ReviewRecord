const express = require("express");
const router = express.Router();
const db = require("../db/index");

router.get("/getuserinfo", (req, res) => {
    console.log("请求：查询用户列表");
    db.query("select * from puzzle", (err, result) => {
        if (err) {
            console.log("查询出错");
            res.send({ status: 1, message: "查询出错", code: 404 });
        } else {
            if (result.length < 1) {
                res.send({ status: 1, message: "获取用户列表失败", code: 400 });
            } else {
                res.send({ status: 0, data: result, message: "获取用户列表成功", code: 200 });
            }
        }
    })
})

//登录验证
router.post("/login", (req, res) => {
    let msg = req.query;
    console.log(msg);
    db.query("select * from puzzle where id=?", msg.id, (err, result) => {
        if (err) {
            console.log("查询出错");
            res.send({ status: 1, message: "查询出错", code: 404 });
        } else {
            if (result[0] == null) {
                res.send({ status: 1, message: "用户名不存在", code: 401 });
                console.log("用户名不存在");
            } else {
                if (result[0].PWD != msg.pwd) {
                    res.send({ status: 1, message: "密码错误", code: 402 });
                    console.log("密码错误");
                } else {
                    res.send({ status: 0, message: "登录成功", code: 200 });
                    console.log("登录成功");
                }
            }
        }
    })
})

router.get("/MonthData", (req, res) => {
    let msg = req.query;
    console.log(msg);
    let dateobject = new Date(msg.date);
    let year = dateobject.getFullYear();
    let month = dateobject.getMonth() + 1;
    console.log(year, month);
    db.query("SELECT DATE_FORMAT(date, '%Y-%m-%d') AS Date,`Schedule` FROM `check` WHERE YEAR(Date) = ? AND MONTH(Date) = ?", [year, month], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log(result);
            res.send({ status: 0, code: 200, data: result });
        }
    })
})

router.get("/DateData", (req, res) => {
    let msg = req.query;
    console.log(msg);
    db.query("SELECT DATE_FORMAT(date, '%Y-%m-%d') AS Date,`Schedule`,IsMath,IsWord,IsEnglish,IsGetup,IsSport,IsCode,IsMianjing,IsDS,IsCCP,IsOS,Record FROM `check` WHERE DATE(Date) = ?", msg.date, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.send({ status: 0, code: 200, data: result });
        }
    })
})

router.post("/ChangeRecord", (req, res) => {
    let msg = req.query;
    console.log(msg);
    let sql = 'UPDATE `check` SET ' + msg.type + ' = ? where DATE(date) = ?';
    db.query(sql, [parseInt(msg.istrue), msg.date], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (msg.istrue === '1') {
                db.query('UPDATE `check` SET Schedule = Schedule + 10 WHERE DATE(date) = ?', msg.date, (e, r) => {
                    if (e) {
                        console.log(e);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        db.query('SELECT Schedule FROM `check` WHERE DATE(date) = ?', msg.date, (ee, rr) => {
                            if (ee) {
                                console.log(ee);
                                res.status(500).json({ error: 'Internal Server Error' });
                            } else {
                                res.send({ status: 0, code: 200, data: rr[0] });
                            }
                        })
                    }
                })
            } else {
                db.query('UPDATE `check` SET Schedule = Schedule - 10 WHERE DATE(date) = ?', msg.date, (e, r) => {
                    if (e) {
                        console.log(e);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        db.query('SELECT Schedule FROM `check` WHERE DATE(date) = ?', msg.date, (ee, rr) => {
                            if (ee) {
                                console.log(ee);
                                res.status(500).json({ error: 'Internal Server Error' });
                            } else {
                                res.send({ status: 0, code: 200, data: rr[0] });
                            }
                        })
                    }
                })
            }
        }
    })
})

router.post("/SendDescribe", (req, res) => {
    let msg = req.query;
    console.log(msg);
    db.query("UPDATE `check` SET Record=CONCAT(Record,?) WHERE DATE(date) = ?", ["|$|" + msg.des, msg.date], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.send({ status: 0, code: 200, data: "添加成功" });
        }
    })
})

router.get("/Descriptions", (req, res) => {
    let msg = req.query;
    console.log(msg);
    db.query("SELECT Record FROM `check` WHERE DATE(date) = ?", msg.date, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            let answer = result[0].Record;
            console.log(answer);
            let sentences = answer.split("|$|");
            res.send({ status: 0, code: 200, data: sentences });
        }
    })
})

// for (let i = new Date("2024-01-01"); i <= new Date("2024-12-31"); i.setDate(i.getDate() + 1)) {
//     console.log(i.getFullYear() + "-" + (i.getMonth() + 1) + "-" + i.getDate());
//     let time = i.getFullYear() + "-" + (i.getMonth() + 1) + "-" + i.getDate()
//     db.query("insert into `record`.`check`(`Date`,`Schedule`,`IsMath`,`IsWord`,`IsEnglish`,`IsGetup`,`IsSport`,`IsCode`,`IsMianjing`,`IsDS`,`IsOS`,`IsCCP`,`Record`) values(?,0,0,0,0,0,0,0,0,0,0,0,'这天没有发生什么...')", time, (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("wancheng");
//         }
//     })
// }

module.exports = router;