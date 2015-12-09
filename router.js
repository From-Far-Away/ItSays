var fs = require('fs');
var User = require('./app/models/user');

module.exports = function(router) {

	var isTokenValid = function() {
		router.use(function(req, res, next) {
			var token = req.headers['x-access-token'] || req.query.token;

			User.findOne({ token: token }, function(err, user) {
				if(err || !user) {
					res.json({
						success: false,
						message: 'Token invalid!'
					});
				} else {
					next();
				}
			});
		});
	}

	// dynamically include routes (Controller)
	fs.readdirSync('./app/controllers').forEach(function (file) {
		if(file.substr(-3) == '.js') {
			route = require('./app/controllers/' + file)(router, isTokenValid);
		}
	});

	return router;
}
