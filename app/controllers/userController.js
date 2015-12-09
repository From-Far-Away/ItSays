var User = require('../models/user');

module.exports = function(router) {
	router.post('/signup', function(req, res) {
		var user = new User();
		
		user.login = req.body.login;
		user.password = req.body.password;

		user.save(function(err) {
			if(err) {
				res.send(err);
			}

			res.json({ message: 'User created!'} );
		});
	});

	router.get('/signin', function(req, res) {
		User.findOne({ login: req.query.username }, function(err, user) {
			if(user.authenticate(req.query.password)) {
				res.json({ token: user.token });
			} else {
				res.json({ token: null });
			}
		});
	});
}