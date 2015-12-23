var mongoose = require('mongoose');
var moment = require('moment');

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
	created_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	created_at: String
});

PublicationSchema.pre('save', function(next) {
	if(!this.created_at) {
		this.created_at = moment().format('YYYY-MM-DD HH:mm');
	}

	next();
});

module.exports = mongoose.model('Publication', PublicationSchema);
