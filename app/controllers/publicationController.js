var User = require('../models/user');
var Publication = require('../models/publication');
var errorCodes = require('../../errorCodes');
var Audio = require('../models/audio');
var Multer = require('multer');

module.exports = function(router, isTokenValid) {
	router.post('/publication', isTokenValid, function(req, res) {
		var publication = new Publication();

		publication.text = req.body.text;
		publication.language = req.body.language;

		publication.created_by = req.user;
		
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

	router.get('/publication/:id', isTokenValid, function(req, res) {
		Publication.findById(req.params.id).populate('audio').exec(function(err, publication) {
			if(err || !publication) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._invalidPublication
				});
			}

			User.findById(publication.created_by, function(err, user) {
				if(err) {
					console.log(err);
					return res.json({ // _UNMANAGED
						success: false
					});
				}

				res.json({
					success: true,
					publication: publication.populate('audio'),
					username: user.username
				});
			});
		});
	});

	router.delete('/publication/:id', isTokenValid, function(req, res) {
		Publication.findById(req.params.id, function(err, publication) {
			if(err || !publication) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._invalidPublication
				});
			}

			if(req.user.id == publication.created_by) {
				publication.remove(function(err) {
					if(err) {
						return res.json({
							success: false,
							errorCode: errorCodes._invalidPublication
						});
					}

					res.json({
						success: true
					});
				});
			} else {
				res.json({
					success: false,
					errorCode: errorCodes._denied
				});
			}
		});
	});
}