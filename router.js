var fs = require('fs');

module.exports = function(router) {
	// dynamically include routes (Controller)
	fs.readdirSync('./app/controllers').forEach(function (file) {
		if(file.substr(-3) == '.js') {
			route = require('./app/controllers/' + file)(router);
		}
	});
	
	return router;
}
