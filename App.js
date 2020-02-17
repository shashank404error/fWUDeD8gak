var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var mysqlConnCredentials = require('./routes/secure-credentials.json');

var indexRouter = require('./routes');
var loginRouter = require('./routes/Login');
var signupRouter = require('./routes/Signup');
var verificationRouter = require('./routes/Email-verification');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname+'/public'));
app.use(fileUpload());

con = mysql.createConnection({
  host: mysqlConnCredentials.host,
  user: mysqlConnCredentials.user,
  password: mysqlConnCredentials.password,
  database: mysqlConnCredentials.database
});

con.connect(function(err) {
  if (err) throw err;
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.post('/data', signupRouter);
app.use('/email-verification', verificationRouter);
app.post('/verification', verificationRouter);
app.post('/homepage', loginRouter);
app.post('/product', indexRouter);
app.post('/recipieUpload', indexRouter);
app.post('/search',indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
