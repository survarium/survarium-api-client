const got = require('got');

const utils = require('./utils');

/**
 * HTTP asker
 * @private
 */
function ask(params) {
	var url = utils.url(this.api, params);
	var method = 'GET';

	var auth = this._sign.make({
		url: url,
		method: method
	});

	return got(url, {
		method: method,
		json: true,
		timeout: 5 * 1000,
		headers: {
			'user-agent': 'Survarium browser',
			'encoding': 'gzip',
			'authorization': auth.header
		}
	})
		.then(function (result) {
			return result.body;
		})
		.catch(function (err) {
			if (err instanceof got.ParseError) {
				return { result: null };
			}
			throw err;
		});
}

module.exports = ask;
