var mongoose = require('mongoose');
var uid = require('rand-token').uid;

var TokenSchema = new mongoose.Schema({
	value: { type: String, required: true, index: true },
	user_id: { type: String, required: true },
	created_at: { type: Date }
});

TokenSchema.pre('save', function(next) {
	var now = new Date();

	this.created_at = now;

	next();
});

TokenSchema.methods.hasExpired = function() {
	var createdDate = this.created_at.getTime();
	var now = new Date().getTime();

	var difference = now - createdDate;

	if(difference > process.env.TOKEN_DURATION) {
		return true;
	}

	return false;
}

module.exports = mongoose.model('Token', TokenSchema);
