var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var localStrategy = require('passport-local-roles').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
var expressValidator = require('express-validator');
var route = require('./routes/index');

//App init
var app = express();


//Creating Mongo connections
mongoose.connect("mongodb://localhost:27017/chatapp",{useMongoClient:true},()=>{
		console.log("Database Connected");
	}
);
var db = mongoose.connection;

//Satting Statis Directory
app.use(express.static(__dirname));

//BodyParser Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect Flash
app.use(flash());

// Global Flash Message variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



//Set routes
app.use('/',route);

//Connecting to port 3000
app.listen("3000",()=>{
	console.log("Started App at port 3000");
})
