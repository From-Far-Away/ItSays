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
		User.findOne({ login: req.body.login }, function(err, user) {
			if(user.authenticate(req.body.password)) {
				res.json({ message: 'connected' });
			} else {
				res.json({ message: 'oups' });
			}
		});
	});
}