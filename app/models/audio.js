var mongoose = require('mongoose');

var AudioSchema = new mongoose.Schema({
	data: Buffer,
	created_by: String,
	created_at: Date
});

AudioSchema.pre('save', function(next) {
	var now = new Date();

	this.created_at = now;

	next();
});

module.exports = mongoose.model('Audio', AudioSchema);
