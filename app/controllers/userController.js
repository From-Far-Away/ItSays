var User = require('../models/user');
var Token = require('../models/token');
var errorCodes = require('../../errorCodes');

module.exports = function(router, isTokenValid) {
	router.post('/signup', function(req, res) {
		var user = new User();
		
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err) {
			if(err) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._userSignUpFailed
				});
			}

			res.json({ 
				success: true
			});
		});
	});

	router.get('/signin', function(req, res) {
		User.findOne({ username: req.query.username }, function(err, user) {
			if(err || !user) {
				return res.json({
					success: false,
					errorCode: errorCodes._invalidUsername
				});
			}

			Token.findOne({ user_id: user.id }, function(err, token) {
				if(err) {
					console.log(err);
					return res.json({ 
						success: false,
						errorCode: errorCodes._userAuthentificationFailed
					});
				}

				var newToken = false;
				var genToken = user.getToken(req.query.password);

				// Is the user hasn't any token create one
				if(!token) {
					newToken = true;
				} else if(token.hasExpired()) { // Is it's token has expired remake it
					// Remove the token because of expiration
					token.remove();
					newToken = true;
				}

				// Save the new token
				if(newToken) {
					token = genToken;

					token.save(function(err) {
						if(err) {
							console.log(err);
							return res.json({ 
								success: false,
								errorCode: errorCodes._userAuthentificationFailed
							});
						}
					});
				}

				res.json({ 
					success: true,
					token: token.value,
					username: user.username
				});
			});
		});
	});

	router.put('/user/edit/', isTokenValid, function(req, res) {
		var userAuth = req.user;

		// Verify password (for security)
		if(!userAuth.isPasswordValid(req.query.password)) {
			return res.json({
				success: false,
				errorCode: errorCodes._invalidPassword
			})
		}

		// update here
		userAuth.password = req.body.password;

		userAuth.save(function(saveErr) {
			if(saveErr) {
				console.log(saveErr);
				return res.json({
					success: false,
					errorCode: errorCodes._userAuthentificationFailed
				});
			}

			res.json({
				success: true
			});
		});
	});

	router.delete('/logout', isTokenValid, function(req, res) {
		var accessToken = req.token;

		accessToken.remove(function(remErr) {
			if(remErr) {
				return res.json({
					success: false,
					errorCode: errorCodes._logoutFailed
				});
			}

			res.json({
				success: true
			});
		});
	});
}