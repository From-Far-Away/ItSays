var mongoose = require('mongoose');
var uid = require('rand-token').uid;

var TokenSchema   = new mongoose.Schema({
	value: { type: String, required: true, index: true },
	userId: { type: String, required: true }
});

TokenSchema.methods.createToken = function(user) {
	// Create a permanent token
	this.value = uid(128);
	this.userId = user;

	if(this.save()) {
		return this.value;
	} else {
		return null;
	}
};


module.exports = mongoose.model('Token', TokenSchema);
