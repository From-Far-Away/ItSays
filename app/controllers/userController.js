var User = require('../models/user');

module.exports = function(router) {
	router.post('/users', function(req, res) {
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
}
