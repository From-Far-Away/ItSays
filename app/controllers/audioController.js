var Publication = require('../models/publication');
var errorCodes = require('../../errorCodes');
var Audio = require('../models/audio');
var Multer = require('multer');
var BufferStream = require('../../bufferStream');

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
				mime: req.file.mimetype,
				created_by: req.user,
				created_by_username: req.username 
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

	router.get('/audio/:audio_id', isTokenValid, function(req, res) {
		Audio.findById(req.params.audio_id).populate('created_by', 'username').exec(function(err, audio) {
			if(err || !audio) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._audioFailure
				});
			}

			res.writeHead(
				200,
				"OK",
				{
					"Content-Type": audio.mime,
					"Content-Length": audio.data.length
				}
			);

			new BufferStream(audio.data)
				.pipe(res);
			
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