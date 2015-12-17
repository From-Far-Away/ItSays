var mongoose = require('mongoose');
var Token = require('./token');
var User = require('./user');

var PublicationSchema = new mongoose.Schema({
	text : {
		type: String, 
		required: true
	},
	langage : {
		type: String, 
		required: true,
		validator: {
			validator: function(str) {
				return /^[a-z]{2}$/.test(str);
			},
			message: 'The langage must comply with ISO 639-1 (two lowercase letters)'
		}
	},
	created_by : {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model('Publication', PublicationSchema);
