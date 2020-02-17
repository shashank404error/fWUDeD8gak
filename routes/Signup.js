var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
require('../App.js');
var mysql = require('mysql');
var mysqlConnCredentials = require('./secure-credentials.json');

con = mysql.createConnection({
    host: mysqlConnCredentials.host,
    user: mysqlConnCredentials.user,
    password: mysqlConnCredentials.password,
    database: mysqlConnCredentials.database
});

router.get('/', function(req, res, next) {
    welMsg = "Hello, User"
    res.render('signup', {
        title: 'FoodServer | Signup',
        welcomeMsg : welMsg,
        headerFileDisplayProperty : "block",
        headerFileLoggedInDisplayProperty : "none",
        desc : 'home/signup'
    });

});

router.post('/data',function (req,res,next) {
    var student = {
        fullName: req.body.fullName,
        emailAdd: req.body.email,
        password: req.body.pass,
        day: req.body.dd,
        month: req.body.mm,
        year: req.body.yyyy,
        sex : req.body.gender
    }
    //console.log(student);

    var verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(verificationCode)

        console.log("Connected!");
        var sql = "INSERT INTO userInfo (uid,name,email,emailVerifyCode,password,dob,gender) VALUES (NULL,'"+student.fullName+"','"+student.emailAdd+"','"+verificationCode+"','"+student.password+"','"+student.day+"/"+student.month+"/"+student.year+"','"+student.sex+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            //send the mail
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'csol191098@gmail.com',
                    pass: 'njpytxxctpkdhncf'
                }
            });

            var mailOptions = {
                from: 'csol191098@gmail.com',
                to: student.emailAdd,
                subject: 'Verification code @ Foodserver',
                html: '<h4>Your verification code is : <b>'+verificationCode+'</b></h4>'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            //email sending ends here

            //rendering verification view
            res.render('email-verification', {
                title: 'Signup',
                msg : "Enter verification code sent to "+ student.emailAdd+ " to continue.",
                welcomeMsg : student.emailAdd,
                desc : 'home/signup/email verification',
                uid: result.insertId,
                vCode : verificationCode,
                headerFileDisplayProperty : "none",
                headerFileLoggedInDisplayProperty : "block"

            });

        });



});


module.exports = router;