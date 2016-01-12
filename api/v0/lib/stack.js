const defaults = require('./defaults');
const ask = require('./ask');
const debug = require('./debug');

var Stack = function (options) {
	this.stack = [];
	this.currentOp = null;
	this.retriesLimit = options.retries !== undefined ? options.retries : defaults.retries;
	this.pause = options.pause !== undefined ? options.pause : defaults.stackPause;
};

Stack.prototype.add = function (fn, opts) {
	var self = this;
	opts = opts || {};
	var retry = opts.retry || 0;
	return new Promise(function (resolve, reject) {
		self.stack[opts.method || 'push'](function () {
			return fn({ retries: 0 })
				.then(function (result) {
					self.currentOp = null;
					return self.move(null, result);
				})
				.then(resolve)
				.catch(function (err) {
					self.currentOp = null;
					if (!ask.retryAllowed(++retry, self.retriesLimit, err)) {
						self.move();
						return reject(err);
					}
					debug(`retry #${retry} [${err.statusCode}] for ${self.pause}ms ${opts.query.method}:${JSON.stringify(opts.query.params)}`);
					return self
						.add(fn, { retry: retry, method: 'unshift', query: opts.query })
						.then(resolve)
						.catch(reject);
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
