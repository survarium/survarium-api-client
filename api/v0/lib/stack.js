const defaults = require('./defaults');
const ask = require('./ask');
const debug = require('./debug');

var Stack = function (options) {
	this.stack = [];
	this.currentOp = null;
	this.pause = options.pause !== undefined ? options.pause : defaults.delayMin;
};

Stack.prototype.add = function (fn, opts) {
	var self = this;
	opts = opts || {};
	return new Promise(function (resolve, reject) {
		self.stack[opts.method || 'push'](function () {
			return fn()
				.then(function (result) {
					self.currentOp = null;
					return self.move(null, result);
				})
				.then(resolve)
				.catch(function (err) {
					self.currentOp = null;
					self.move();
					return reject(err);
				});
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
