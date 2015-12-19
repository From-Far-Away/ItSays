var mongoose = require('mongoose');

var PublicationSchema = new mongoose.Schema({
	text: {
		type: String, 
		required: true
	},
	language: {
		type: String, 
		required: true
	},
	audio: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Audio"
	}],
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	created_by: String,
	created_at: Date
});

PublicationSchema.pre('save', function(next) {
	var now = new Date();

	if(!this.created_at) {
		this.created_at = now;
	}

	next();
});

module.exports = mongoose.model('Publication', PublicationSchema);
