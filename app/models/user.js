var mongoose = require('mongoose');
var hashMethod = require('crypto-js/sha256');
var crypto = require('crypto');
var uid = require('rand-token').uid;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	login: { type: String, unique: true, index: true, required: true },
	password: { type: String, required: true },
	salt: Buffer,
	token: { type: String, default: null }
});

UserSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) {
		return next();
	}

	user.salt = crypto.randomBytes(16);
	user.password = hashMethod(user.password + user.salt);

	next();
});

UserSchema.methods.authenticate = function(password) {
	var hash = hashMethod(password + this.salt);

	if(hash.toString() === this.password) {
		this.token = uid(128);

		this.save();

		return true;
	} else {
		return false;
	}
};

module.exports = mongoose.model('User', UserSchema);