var mongoose = require('mongoose');
var Token = require('./token');
var User = require('./user');

var PublicationSchema = new mongoose.Schema({
	text: {
		type: String, 
		required: true
	},
	language: {
		type: String, 
		required: true
	},
	created_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
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
