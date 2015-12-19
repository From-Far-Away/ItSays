var mongoose = require('mongoose');
var hashMethod = require('crypto-js/sha256');
var crypto = require('crypto');
var Token = require('./token');
var uid = require('rand-token').uid;

var UserSchema = new mongoose.Schema({
	username: { 
		type: String, 
		unique: true, 
		index: true, 
		required: true,
		validate: {
			validator: function(str) {
				return /^[a-z0-9]{3,}$/i.test(str);
			},
			message: 'A valid username should only contains aphanumerical characters!'
		} 
	},
	password: { type: String, required: true },
	salt: Buffer,
	created_at: Date,
	updated_at: Date
});

UserSchema.pre('save', function(next) {
	var user = this;
	var now = new Date();

	if(!this.created_at) {
		user.created_at = now;
	}

	if(!user.isModified('password')) {
		return next();
	}

	user.salt = crypto.randomBytes(16);
	user.password = hashMethod(user.password + user.salt);

	next();
});

UserSchema.methods.getToken = function(password) {
	if(this.isPasswordValid(password)) {
		var token = new Token({ value: uid(128), user_id: this.id });

		return token;
	} else {
		return null;
	}
};

UserSchema.methods.isPasswordValid = function(password) {
	var hash = hashMethod(password + this.salt);

	if(hash.toString() === this.password) {
		return true;
	} else {
		return false;
	}
}

module.exports = mongoose.model('User', UserSchema);