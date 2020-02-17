var express = require('express');
var router = express.Router();
require('../App.js');
var mysql = require('mysql');
var mysqlConnCredentials = require('./secure-credentials.json');

con = mysql.createConnection({
    host: mysqlConnCredentials.host,
    user: mysqlConnCredentials.user,
    password: mysqlConnCredentials.password,
    database: mysqlConnCredentials.database
});

router.post('/verification',function (req,res,next) {
        if(req.body.vcode==req.body.vCodeuser){

                var resultDB;
                con.query("SELECT * FROM commonAppTable", function (err, result, fields) {
                    if (err) throw err;
                    res.render('index', {
                        title: 'FoodServer | homepage',
                        welcomeMsg: req.body.uname,
                        desc: 'Home',
                        foodObj : result,
                        headerFileDisplayProperty : "none",
                        headerFileLoggedInDisplayProperty : "block",
                        foodOrigin : "Manit Hostel"
                    });
                });

        }
        else{
            res.render('email-verification', {
                title: 'FoodServer | login',
                msg : "Enter the correct verification code.",
                welcomeMsg : "Hello, User",
                desc : 'home/login',
                uid : req.body.uid,
                vCode: req.body.vcode,
                headerFileDisplayProperty : "block",
                headerFileLoggedInDisplayProperty : "none",
                uname : req.body.uname
            });
        }
});



module.exports = router;