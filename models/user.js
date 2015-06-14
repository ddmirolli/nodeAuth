var mongoose 	= require('mongoose');

mongoose.connect('mongodb://locol');

var db = mongoose.connection;

//User Schema
var UserSchema 	= mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password:{
		type: String
	},
	email:{
		type: String
	},
	name:{
		type: String
	},
	profileimage:{
		type: String
	}
});

var User = module.exports = mongoose.models('User', UserSchema);

module.exports.createUser	= function(newUser, callback){
	newUser.save(callback);
}