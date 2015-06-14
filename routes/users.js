var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


var User 	= require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{
  	'title': 'Register'
  });
});
router.get('/login', function(req, res, next) {
  res.render('login',{
  	'title': 'Login'
  });
});

router.post('/register', function(req,res,next){
		// Get form values
		var name = req.body.name
		var email = req.body.email;	
		var username = req.body.username;
		var password = req.body.password;
		var password2 = req.body.password2;


	// Check for image field
	if(req.files.profileimage){
		console.log('Uploading file...');

		var profileImgOName 	= req.files.profileimage.originalname;
		var profileImageName 	= req.files.profileimage.name;
		var profileImageMime 	= req.files.profileimage.mimetype;
		var profileImagePath 	= req.files.profileimage.path;
		var profileImageExt 	= req.files.profileimage.extension;
		var profileImageSize 	= req.files.profileimage.size;
	} else {
		// Set a default image
		var profileImageName 	= 'noimage.png';
	}



	// Form validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email not valid').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2,
		});
	}else{
		var newUser	=	new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: profileImageName
		});

		// Create user
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		//Success Message
		req.flash('success','You are now registered and may log in');

		res.location('/');
		res.redirect('/');
	}

});

passport.use(new localStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log('Unknown user');
				return done(null, false, {message: "Unknown User"});
			}


		});
	}
));

router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid usernameor password'}), function(req, res){
	console.log('Authentication Successful');
	req.flash('success', 'You are logged in');
	res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You are now logged out');
	res.redirect('/users/login');
});


module.exports = router;
