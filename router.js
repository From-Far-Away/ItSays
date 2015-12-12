var fs = require('fs');
var Token = require('./app/models/token');
var User = require('./app/models/user');

module.exports = function(router) {

	var isTokenValid = function(req, res, next) {
		var accessToken = req.headers['x-access-token'] || req.query.token;

		Token.findOne({ value: accessToken }, function(err, token) {
			if(err || !token) {
				console.log(token);
				return next(res.json({
					success: false,
					message: 'Token invalid...'
				}));
			}

			User.findById(token.userId, function(findErr, user) {
				if(!user) {
					return next(res.json({
						success: false,
						message: 'User not found!'
					}));
				} else {
					req.user = user;
					req.token = token;
					next();
				}
			});
		});
	}

	// dynamically includes routes (Controller)
	fs.readdirSync('./app/controllers').forEach(function (file) {
		if(file.substr(-3) == '.js') {
			route = require('./app/controllers/' + file)(router, isTokenValid);
		}
	});

	return router;
}
