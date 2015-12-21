var Publication = require('../models/publication');
var errorCodes = require('../../errorCodes');
var Audio = require('../models/audio');
var Multer = require('multer');

module.exports = function(router, isTokenValid) {
	// Multer can manage multipart header
	router.post('/publication/:id/audio', [ isTokenValid, Multer().single('audio') ], function(req, res) {
		Publication.findById(req.params.id, function(err, publication) {
			if(err || !publication) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._invalidPublication
				});
			}

			var audio = new Audio({ 
				data: req.file.buffer,
				created_by: req.user 
			});

			audio.save(function(err) {
				if(err) {
					console.log(err);
					return res.json({
						success: false,
						errorCode: errorCodes._audioFailure
					});
				}

				publication.audio.push(audio);
				publication.save();

				res.json({
					success: true
				});
			});
		});
	});

	router.delete('/publication/:id/audio/:audio_id', isTokenValid, function(req, res) {
		Publication.findById(req.params.id, function(err, publication) {
			if(err || !publication) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._invalidPublication
				});
			}

			Audio.findById(req.params.audio_id, function(err, audio) {
				if(err || !audio) {
					console.log(err);
					return res.json({
						success: false,
						errorCode: errorCodes._audioFailure
					});
				}

				if(req.user != audio.created_by) {
					return res.json({
						success: false,
						errorCode: errorCodes._denied
					});
				}

				publication.audio.pull(audio.id);
				publication.save();

				audio.remove(function(err) {
					if(err) {
						return res.json({
							success: false,
							errorCode: errorCodes._audioFailure
						});
					}

					res.json({
						success: true
					});
				});
			});
		});
	});
}