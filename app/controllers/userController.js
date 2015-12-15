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

			var tokenAccess = user.getToken(req.query.password);

			if(tokenAccess) {
				res.json({ 
					success: true,
					token: tokenAccess,
					id: user.id,
					username: user.username
				});
			} else {
				res.json({ 
					success: false,
					errorCode: errorCodes._userAuthentificationFailed
				});
			}
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