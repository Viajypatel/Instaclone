var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');
const MongoStore = require('connect-mongo');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport');
const mongoose=require("mongoose");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const dburl = "mongodb+srv://vijaypatel114200:T7hRFvntTqwHE4y4@cluster0.zz20hw5.mongodb.net/Pindb1144";
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(expressSession({
  resave: false, 
  saveUninitialized: false,
  secret: "hey hi hellojjjjj",
  store: new MongoStore({ 
    mongoUrl: dburl, // Provide the MongoDB URL directly
    dbName: 'Pindb1144', // Specify the database name
    mongooseConnection: mongoose.connection, // Provide mongoose connection as client
  })
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
