var User = require('../models/user');

module.exports = function(router, isTokenValid) {
	router.post('/signup', function(req, res) {
		var user = new User();
		
		user.login = req.body.login;
		user.password = req.body.password;

		user.save(function(err) {
			if(err) {
				res.json({
					success: false,
					message: err
				});
			}

			res.json({ 
				success: true,
				message: 'User ' + user.login + ' created!'
			});
		});
	});

	router.get('/signin', function(req, res) {
		User.findOne({ login: req.query.username }, function(err, user) {
			if(user.isAuthenticated(req.query.password)) {
				res.json({ 
					success: true,
					token: user.token,
					id: user.id,
					message: 'Authenticated as ' + user.login
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
				return res.json({
					success: false,
					message: findErr
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
					res.json({
						success: false,
						message: saveErr
					});
				}

				res.json({
					success: true,
					message: 'Update completed!'
				});
			});
		});
	});
}