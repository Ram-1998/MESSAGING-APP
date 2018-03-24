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
	blockedUsers:[String]
});
var User = module.exports = mongoose.model('User',UserSchema);
//Create User
module.exports.createUser = function(newUser,callback){
	newUser.password = md5(newUser.password);
	console.log(newUser.password);
	newUser.save(callback);
}
module.exports.getUserByUname = function(uname,callback){
	console.log("Finding User By Email");
	var query = {uname: uname};
	console.log(query);
	User.findOne(query,callback);
}

