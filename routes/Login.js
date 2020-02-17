var express = require('express');
var router = express.Router();
require('../App.js');
var mysql = require('mysql');
const apiRequestCall = require('./Request');
var mysqlConnCredentials = require('./secure-credentials.json');

con = mysql.createConnection({
    host: mysqlConnCredentials.host,
    user: mysqlConnCredentials.user,
    password: mysqlConnCredentials.password,
    database: mysqlConnCredentials.database
});

welMsg = "Hello, User"
router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'FoodServer | login',
        welcomeMsg : welMsg,
        desc : 'home/login',
        headerFileDisplayProperty : "block",
        headerFileLoggedInDisplayProperty : "none"
    });
});

router.post('/homepage',function (req,res,next) {
    con.query("SELECT * FROM userInfo where email= '"+req.body.loginEmail+"' ", function (err, result, fields) {
        if (err) throw err;
        if(result[0].password==req.body.loginPass){
            con.query("SELECT * FROM commonAppTable", function (err, result1, fields) {
                if (err) throw err;
                res.render('index', {
                    title: 'FoodServer | homepage',
                    welcomeMsg: result[0].email,
                    foodObj: result1,
                    foodOrigin: "manit Hostel",
                    headerFileDisplayProperty : "none",
                    headerFileLoggedInDisplayProperty : "block",
                    desc: "Home",
                    userId : result[0].uid
                });
            });
        }
        else{
            res.render('login', {
                title: 'FoodServer | login',
                welcomeMsg : welMsg,
                desc : 'home/login',
                headerFileDisplayProperty : "block",
                headerFileLoggedInDisplayProperty : "none"
            });
        }
    });

});
module.exports = router;