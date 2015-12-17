var User = require('../models/user');
var Token = require('../models/token');
var Publication = require('../models/publication');
var errorCodes = require('../../errorCodes');

module.exports = function(router, isTokenValid) {
	router.post('/publish', isTokenValid, function(req, res) {
		var publication = new Publication();

		publication.text = req.body.text;
		publication.langage = req.body.langage;

		// Add the created_by field to the publication after successfully retrieving the user
		publication.created_by = req.query.user;
		
		publication.save(function(err) {
			if(err) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._publishFailed
				});
			}
			res.json({ 
				success: true
			});
		});
	});

	router.get('/publications', isTokenValid, function(req, res) {
		Publication.find({}, function(err, publications) {
			res.json({ 
				success: true,
				publications: publications
			});
		});
	});
}