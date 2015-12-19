var Publication = require('../models/publication');
var errorCodes = require('../../errorCodes');
var Comment = require('../models/comment');

module.exports = function(router, isTokenValid) {
	router.post('/publication/:id/comment', isTokenValid, function(req, res) {
		Publication.findById(req.params.id, function(err, publication) {
			if(err || !publication) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._invalidPublication
				});
			}

			var comment = new Comment({
				text: req.body.text,
				created_by: req.user
			});

			publication.comments.push(comment);
			publication.save();

			comment.save(function(err) {
				if(err) {
					console.log(err);
					return res.json({
						success: false,
						errorCode: errorCodes._commentFailure
					});
				}

				res.json({
					success: true
				});
			});
		});
	});

	router.delete('/publication/:id/comment/:com_id', isTokenValid, function(req, res) {
		Publication.findById(req.params.id, function(err, publication) {
			if(err || !publication) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._invalidPublication
				});
			}

			Comment.findById(req.params.com_id, function(err, comment) {
				if(err || !comment) {
					console.log(err);
					return res.json({
						success: false,
						errorCode: errorCodes._commentFailure
					});
				}

				if(req.user != comment.created_by) {
					return res.json({
						success: false,
						errorCode: errorCodes._denied
					});
				}

				publication.comments.pull(comment.id);
				publication.save();

				comment.remove(function(err) {
					if(err) {
						return res.json({
							success: false,
							errorCode: errorCodes._commentFailure
						});
					}

					res.json({
						success: true
					});
				});
			});
		});
	});

	router.put('/publication/:id/comment/:com_id', isTokenValid, function(req, res) {
		Publication.findById(req.params.id, function(err, publication) {
			if(err || !publication) {
				console.log(err);
				return res.json({
					success: false,
					errorCode: errorCodes._invalidPublication
				});
			}

			Comment.findById(req.params.com_id, function(err, comment) {
				if(err || !comment) {
					console.log(err);
					return res.json({
						success: false,
						errorCode: errorCodes._commentFailure
					});
				}

				if(req.user != comment.created_by) {
					return res.json({
						success: false,
						errorCode: errorCodes._denied
					});
				}

				comment.text = req.body.text;

				comment.save(function(err) {
					if(err) {
						return res.json({
							success: false,
							errorCode: errorCodes._commentFailure
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