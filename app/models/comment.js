var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	text: String,
	created_by: String,
	created_at: Date,
	updated_at: Date
});

CommentSchema.pre('save', function(next) {
	var now = new Date();

	if(this.isModified('text')) {
		this.updated_at = now;
	}

	if(!this.created_at) {
		this.created_at = now;
	}

	next();
});

module.exports = mongoose.model('Comment', CommentSchema);
