'use strict';

const qs     = require('querystring');
const crypto = require('crypto');
const config = require('../configs');

/**
 * Generate random string for signature
 *
 * @return string
 */
function generateSalt() {
	var salt = crypto.createHash('md5');
	salt.update((Math.random() + ts()).toString());
    return salt.digest('hex');
}

function ts() {
	return Date.now() / 1000 >>> 0;
}

function makeUrl(params) {
	var url = config.api + params.path;
	var query = params.query;
	if (query) {
		url += '?' + qs.stringify(query);
	}
	return url;
}

Object.defineProperties(module.exports, {
	'salt': {
		get: generateSalt,
		enumerable: true
	},
	ts: {
		get: ts,
		enumerable: true
	}
});

module.exports.url = makeUrl;
