var fs = require('fs');
var Token = require('./app/models/token');
var User = require('./app/models/user');
var errorCodes = require('./errorCodes');

module.exports = function(router) {

	var isTokenValid = function(req, res, next) {
		var accessToken = req.headers['x-access-token'] || req.query.token;

		Token.findOne({ value: accessToken }, function(err, token) {
			if(err || !token) {
				res.json({
					success: false,
					errorCode: errorCodes._invalidAccessToken
				});
				return next('Token not found');
			}

			User.findById(token.user_id, function(findErr, user) {
				if(!user) {
					res.json({
						success: false,
						errorCode: errorCodes._userNotFound
					});
					return next('User not found');
				} else {
					req.user = user.id;
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
