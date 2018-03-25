var mongoose = require("mongoose");
var md5 = require("md5");

var UserSchema = mongoose.Schema({
	fname : String,
	lname : String,
	uname : {
		type:String,
		unique:true,
		required:true
	},
	password:String,
	blockedUsers:[String],
	messages:[{
		sender:String,
		subject:String,
		body:String
	}]
});
var User = module.exports = mongoose.model('User',UserSchema);
//Create User
module.exports.createUser = function(newUser,callback){
	newUser.password = md5(newUser.password);
	console.log(newUser.password);
	newUser.save(callback);
}
module.exports.getUserById = function(id,callback){
	User.findById(id,callback);
}
module.exports.getUserByUname = function(uname,callback){
	console.log("Finding User By Username");
	var query = {uname: uname};
	console.log(query);
	User.findOne(query,callback);
}
module.exports.comparePassword = function(password,database_password,callback){
	console.log("Matching Password");
	console.log(password + " " + database_password);
	var isMatch;
	if(password == database_password ){
		isMatch = true;
	}
	else {
		isMatch = false;
	}
	callback(null,isMatch);
}
module.exports.blockUser = function(currUser,userToBlock,callback){
	User.update({uname: currUser.uname},{$push:{blockedUsers: userToBlock}},callback);
}

module.exports.sendMessage = function(receiver,message,callback){
	User.update({uname: receiver.uname},{$push:{messages: message}},callback);
}
