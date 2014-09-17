var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	 passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
	email : String,
	password : String
});

User.plugin(passportLocalMongoose);

User.static('userExists', function(userEmail, callback) {
	var users = this.findOne({email : userEmail});
	console.log(users[0]);
	//return (typeof(user) != 'undefined' && user != null);
	
	/*
	var user = this.findOne({email : userEmail}, function(err,obj) { 
		if(err){
			console.log("Err:" + err); 
			return null;
		}
		console.log("o:"+obj);
		return obj;
		
	});
	console.log("u:"+user[0]);*/
	return (user[0].email != null && user[0].email != 'undefined');
	
});

module.exports = mongoose.model('User', User);

