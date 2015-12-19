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
	created_by: {
		type: String
	},
	created_at: {
		type: Date
	}
});

PublicationSchema.pre('save', function(next) {
	var now = new Date();

	this.created_at = now;

	next();
});

module.exports = mongoose.model('Publication', PublicationSchema);
