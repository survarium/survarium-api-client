const defaults = require('./defaults');
const ask = require('./ask');
const debug = require('./debug');

var Stack = function (options) {
	this.stack = [];
	this.currentOp = null;
	this.pause = options.pause !== undefined ? options.pause : defaults.delayMin;
};

Stack.prototype.next = function (response, err, result) {
	this.currentOp = null;
	return response(this.move(err, result));
};

Stack.prototype.add = function (fn, opts) {
	var self = this;
	opts = opts || {};
	return new Promise(function (resolve, reject) {
		self.stack[opts.method || 'push'](function () {
			return fn()
				.then(self.next.bind(self, resolve, null))
				.catch(self.next.bind(self, reject, null))
		});
		self.move();
	});
};

Stack.prototype.move = function (err, result) {
	var self = this;
	if (!self.currentOp && self.stack.length) {
		self.currentOp = setTimeout(function () {
			self.stack.shift()();
		}, self.pause);
	}
	if (err) {
		throw err;
	}
	return result;
};

module.exports = Stack;
