var User = require('../models/user');
var Token = require('../models/token');
var Publication = require('../models/publication');

module.exports = function(router, isTokenValid) {
	router.post('/publish', function(req, res) {
		var publication = new Publication();

		publication.text = req.body.text;
		publication.langage = req.body.langage;

		var accessToken = req.headers["x-access-token"];

    	new Token().getUserByToken(accessToken, function(user){

    		/* 
    		There are two ways to specify that an instance has no valid reference in JavaScript,
    		either with "undefined" or more rarely with "null" keyword. Mogoose is one
    		of library which return null when it doesn't found entry with findOne()
    		*/
    		if(user !== null) {

				// Add the created_by field to the publication after successfully retrieving the user
				publication.created_by = user.userId;
				
				publication.save(function(err) {
					if(err) {
						console.log(err);
						return res.json({
							success: false,
							message: 'Publish failed...'
						});
					}
					res.json({ 
						success: true,
						message: 'Publish succeeded!'
					});
				});

			// If user === null, that mean the access token isn't related to any valid user
			} else {
				res.json({
					success: false,
					message: 'Wrong access token :('
				});
			}
		});
	});

	router.get('/publications', function(req, res) {
		
		var accessToken = req.headers["x-access-token"];

    	new Token().getUserByToken(accessToken, function(user){
    		if(user !== null) {
				new Publication().getPublications(function(publications){
					res.json({ 
						success: true,
						publications: publications
					});
				});
			} else {
				res.json({
					success: false,
					message: 'Wrong access token :('
				});
			}
		});
	});
}