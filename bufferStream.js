var stream = require('stream');
var util = require('util');
var http = require('http');
var fs = require('fs');

// @credits to Ben Nadel

function BufferStream(src) {
	if(!Buffer.isBuffer(src)) {
		throw(new Error("It's not a Buffer..."));
	}

	stream.Readable.call(this);

	this._src = src;
	this._offset = 0;
	this._length = src.length;

	this.on("end", this._destroy);

}

util.inherits(BufferStream, stream.Readable);

BufferStream.prototype._destroy = function() {
	this._src = null;
	this._offset = null;
	this._length = null;
};

BufferStream.prototype._read = function(size) {
	if(this._offset < this._length) {
		this.push(this._src.slice(this._offset, (this._offset + size)));

		this._offset += size;
	}

	if(this._offset >= this._length) {
		this.push(null);
	}
};

module.exports = BufferStream;