// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
// call express
var app = express();
// define our app using express
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('./app/models/user');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(passport.initialize());

var port = process.env.PORT || 8080;
// set our port



var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
	// Create your schemas and models here.
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost/passport_local_mongoose');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();
// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
	// make sure we go to the next routes and don't stop here
});

//

router.route('/users')
	
	// create a user (accessed at POST http://localhost:8080/api/users)
	.post(function(req, res) {
	
		var userEmail = req.body.email;
		console.log('Recived POST message ' + userEmail)
		var exists =  true;//User.userExists(userEmail);
		if (exists) {
			console.log('user not found ' + userEmail);
			// create a new instance of the User model
			var user = new User();
			// set the user email (comes from the request)
			user.email = userEmail;
			user.password = req.body.password;
	
			// save the user and check for errors
			user.save(function(err) {
				if (err)
					res.send(err);
	
				res.json({
					message : 'User created!'
				});
			});
		}
		else {
			res.json({
					message : 'User Exists!'
				});
		}
	
	});

router.route('/register').post(function(req, res) {
	User.register(new User({ username : req.body.email }), req.body.password, function(err, user) {
        if (err) {
            res.send(err);
        }else
        res.json({
					message : 'User created!'
				});

    });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /safari
app.use('/safari', router);
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to safari' });	
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
