var mongoose = require('mongoose');
var hashMethod = require('crypto-js/sha256');
var crypto = require('crypto');
var Token = require('./token');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
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
	created_at: { type: Date },
	updated_at: { type: Date }
});

UserSchema.pre('save', function(next) {
	var user = this;
	var now = new Date();

	if(!this.created_at) {
		this.created_at = now;
	}

	if(!user.isModified('password')) {
		return next();
	}

	user.salt = crypto.randomBytes(16);
	user.password = hashMethod(user.password + user.salt);

	next();
});

UserSchema.methods.getToken = function(password) {
	var token = new Token().createToken(this.id);

	if(this.isPasswordValid(password) && token) {
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