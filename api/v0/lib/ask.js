const got = require('got');
const parseJson = require('parse-json');
const debug = require('debug')('survarium-api-client');
const Promise = require('bluebird');

const utils = require('./utils');

/**
 * HTTP asker
 * @private
 */
function ask(params) {
	var opts = this.options;
	var retriesLimit = opts.retries || 10;

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

	var retry = function (err) {
		if (retries > retriesLimit || (err && err.statusCode > 199 && err.statusCode < 500 && err.statusCode !== 429)) {
			throw err;
		}
		var delay = (200 + Math.pow(3, retries++) + Math.random() * 100) >>> 0;
		debug(`${err && err.statusCode && '[' + err.statusCode + '] ' || ''}retry #${retries} in ${delay}ms ${url}`);
		return new Promise
			.delay(delay, options)
			.then(got.bind(got, url))
			.catch(retry);
	};

	var run = function () {
		return got(url, options)
			.catch(retry)
			.then(function (result) {
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
	};

	return run();
}

module.exports = ask;
