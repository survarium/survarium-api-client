const fs = require('fs');
const got = require('got');
const parseJson = require('parse-json');
const debug = require('./debug');
const defaults = require('./defaults');
const Promise = require('bluebird');

const utils = require('./utils');

function retryAllowed(retries, retriesLimit, err) {
	return !(!retriesLimit || retries > retriesLimit || (err && err.statusCode > 199 && err.statusCode < 500 && err.statusCode !== 429));
}

/**
 * HTTP asker
 */
function ask(params, opts) {
	opts = opts || this.options;
	var retriesLimit = opts.retries;
	var url = utils.url(this.api, params);
	var method = 'GET';

	var auth = this._sign.make({
		url: url,
		method: method
	});

	var options = {
		method: method,
		timeout: 5 * 1000,
		retries: 0,
		headers: {
			'user-agent': 'Survarium browser',
			'encoding': 'gzip',
			'authorization': auth.header
		}
	};

	var retries = 0;

	var request = function (url) {
		debug(`quering ${url}`);
		return got.apply(got, arguments);
	};

	var retry = function (err) {
		if (!retryAllowed(++retries, retriesLimit, err)) {
			throw err;
		}
		var delay = (defaults.delayMin + defaults.delayMax * retries *  Math.random()) >>> 0;
		debug(`error [${err.statusCode}], plan retry #${retries} after ${delay}ms for ${url}`);
		return new Promise
			.delay(delay, options)
			.then(request.bind(null, url))
			.catch(retry);
	};

	var ts = process.hrtime();

	var run = function () {
		var runner = request(url, options)
			.catch(retry)
			.then(function (result) {
				ts = process.hrtime(ts);
				debug(`completed ${url} with ${retries} retries in ${(ts[0] + ts[1] / 1e9).toFixed(2)}sec.`);
				var body = result.body;
				try {
					return parseJson(body);
				} catch (e) {
					var error = new got.ParseError(e, {
						host: result.socket._host,
						hostname: result.socket._host,
						method: result.socket.method,
						path: result.socket.path
					});
					error.response = body;
					throw error;
				}
			});
		if (opts.saveSource) {
			runner = runner.then(function (result) {
				var dst = opts.saveSource + utils.file(params);
				fs.appendFile(dst, JSON.stringify(result, null, 4), 'utf8', function (err) {
					if (err) {
						debug('cannot save source', dst, err);
					}
					debug('source saved', dst);
				});
				return result;
			});
		}

		return runner;
	};

	return run();
}

ask.retryAllowed = retryAllowed;

module.exports = ask;
