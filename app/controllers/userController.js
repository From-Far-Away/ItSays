var User = require('../models/user');

module.exports = function(router, isTokenValid) {
	router.post('/signup', function(req, res) {
		var user = new User();
		
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err) {
			if(err) {
				console.log(err);
				res.json({
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
			if(user.isAuthenticated(req.query.password)) {
				res.json({ 
					success: true,
					token: user.token,
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

	// -------- TOKEN VERIFICATION FIREWALL

	isTokenValid();

	router.put('/user/:id', function(req, res) {
		User.findById(req.params.id, function(findErr, user) {
			if(findErr) {
				console.log(findErr);
				return res.json({
					success: false,
					message: 'Oups... Something went wrong'
				});
			}

			if(!user) {
				return res.json({
					success: false,
					message: 'User not found...'
				});
			} else if(!user.isPasswordValid(req.query.password)) {
				return res.json({
					success: false,
					message: 'Invalid password...'
				})
			}

			// update here
			user.password = req.body.password;

			user.save(function(saveErr) {
				if(saveErr) {
					console.log(saveErr);
					res.json({
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
	});

	router.put('/logout', function(req, res) {
		var token = req.headers['x-access-token'] || req.query.token;

		User.findOne({ token: token }, function(err, user) {
			if(err || !user) {
				console.log(err);
				res.json({
					success: false,
					message: 'Token invalid!'
				});
			} else {
				user.token = null;

				user.save(function(saveErr) {
					if(saveErr) {
						console.log(saveErr);
						res.json({
							success: false,
							message: 'Oups... Something went wrong!'
						});
					}

					res.json({
						success: true,
						message: 'Disconnected!'
					});
				});
			}
		});
	});
}