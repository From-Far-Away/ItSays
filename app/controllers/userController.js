var User = require('../models/user');
var Token = require('../models/token');

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
					message: 'User creation failed...'
				});
			}

			res.json({ 
				success: true,
				message: 'User ' + user.username + ' created!'
			});
		});
	});

	router.get('/signin', function(req, res) {
		User.findOne({ username: req.query.username }, function(err, user) {
			if(err || !user) {
				return res.json({
					success: false,
					message: "This username doesn't exists"
				});
			}

			var tokenAccess = user.getToken(req.query.password);

			if(tokenAccess) {
				res.json({ 
					success: true,
					token: tokenAccess,
					id: user.id,
					message: 'Authenticated as ' + user.username
				});
			} else {
				res.json({ 
					success: false,
					token: null,
					message: 'Wrong password!'
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
				message: 'Invalid password...'
			})
		}

		// update here
		userAuth.password = req.body.password;

		userAuth.save(function(saveErr) {
			if(saveErr) {
				console.log(saveErr);
				return res.json({
					success: false,
					message: 'Oups... Something went wrong!'
				});
			}

			res.json({
				success: true,
				message: 'Update completed!'
			});
		});
	});

	router.delete('/logout', isTokenValid, function(req, res) {
		var accessToken = req.token;

		accessToken.remove(function(remErr) {
			if(remErr) {
				return res.json({
					success: false,
					message: 'Oups... Something went wrong!'
				});
			}

			res.json({
				success: true,
				message: 'Disconnected'
			});
		});
	});
}