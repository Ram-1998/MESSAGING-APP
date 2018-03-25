var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var md5 = require('md5');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.get('/',function(req,res){

	// res.render('login_signup',{layout: 'layout_login_signup'});
	// console.log('home page started');
	if(req.isAuthenticated()){
		res.json("User Logged In Already");
	}
	else
	{
		res.json("User Is Not logged In !!");
	}

});



//Register user
router.post('/register',jsonParser,function(req,res){
	console.log(req.body);
	var fname = req.body.fname;
	var lname = req.body.lname;
	var uname = req.body.uname;
	var password = req.body.password;
	var confirm_password = req.body.confirm_password;
	//var user_level = req.body.user_level;

	//Validation
	req.checkBody('fname','fname is required').notEmpty();
	req.checkBody('lname','lname is required').notEmpty();
	req.checkBody('uname','uname is required').notEmpty();	
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('confirm_password','Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		req.flash('error',errors);
		res.json("User Details Missing");

		console.log(errors);
	}
	else{
		User.getUserByUname(uname, function(err, user){
			if(err) throw err;
			if(user){
				console.log(user);
				console.log("user already Exist");
				res.json("User Already Exist")
			}
			else {
				var newUser = new User({
					fname: fname,
					lname: lname,
					uname: uname,
					password: password
				});

				User.createUser(newUser,function(err,user){
					if(err) throw err;
					console.log(user);
				});
				console.log('registered');
				// req.flash('success_msg','Registration Successfull: Now you can login to your account');
				// res.redirect('/');
				console.log("User Created Succefully")
				res.json("User Created Succesfully")
			}
		});
	}
});

//login using local-strategy
passport.use(new LocalStrategy({
		usernameField: 'uname',
		passwordField: 'password'
	},
  function(username, password, done) {
  	console.log("Finding User !!")
	User.getUserByUname(username,function(err,user){
		if(err) throw err;

		// var entered_password = md5(password);
		if(!user) {
			console.log("User Not Found !");
			return done(null,false,{message: 'Unknown user'})
		}
		else{
			console.log("User Found :)");
			console.log(user.password);
			if(User.comparePassword(md5(password),user.password,function(err,isMatch){
				if(err) throw err;
				console.log(isMatch);
				if(!isMatch){
					console.log("Password Not Match :(");
					return done(null,false,{message: 'Invalid Password'});
				}
				else{
					console.log("Logged In :)");
					return done(null,user);
				}
			}));

		}
	});
	}
));

//Serialization
passport.serializeUser(function(user, done) {
	console.log(user);
  done(null, user.id);
});

//Deserialization
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//login
router.post('/login', function(req, res, next) {
	console.log("try to log in !")
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err)
    if (!user) {
			req.flash('error_msg', 'Invalid Details');
      return res.json("imvaild credentials")
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      	console.log("Logged In Succesfully")
      return res.json("Hello " + user.fname);
    });
  })(req, res, next);
});


//login
router.get('/apply/:userName',function(req,res){
	var userToBlock = req.params.userName;
	var currUser = req.user;
	console.log(userToBlock);
	console.log(currUser);


	User.blockUser(currUser,userToBlock,function(err,result){
			if(err) throw err;
			// console.log(currUser);
			res.json("User "+currUser.name+" Blocked User "+ userToBlock)
		});


});

module.exports = router;