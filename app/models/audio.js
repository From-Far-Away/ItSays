var mongoose = require('mongoose');
var moment = require('moment');

var AudioSchema = new mongoose.Schema({
	data: Buffer,
	mime: String,
	created_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	created_by_username: String,
	created_at: String
});

AudioSchema.pre('save', function(next) {
	this.created_at = moment().format('YYYY-MM-DD HH:mm');

	next();
});

module.exports = mongoose.model('Audio', AudioSchema);
