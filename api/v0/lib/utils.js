'use strict';

const qs     = require('querystring');
const crypto = require('crypto');

const DEFAULT_LANG = 'english';

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

function makeUrl(api, params) {
	var url = api + params.path;
	var query = params.query;
	if (query) {
		url += '?' + qs.stringify(query);
	}
	return url;
}

function makeFileName(params) {
	return params.path + '_' +
		qs.stringify(params.query).replace('&', '_') +
		((new Date()).getTime() / 1000 >>> 0) +
		'.json';
}

function error(message) {
	var err = new Error(message);
	err.statusCode = 400;
	return err;
}

var parseNum = (function () {
	let test = /^\d+$/;
	/**
	 * There is no converting to Number because of UInt
	 */
	return function parseNum(id, name) {
		name = name || 'id';
		if ([undefined, null].indexOf(id) > -1) {
			throw error(`no ${name} received`);
		}

		if (typeof id !== 'number') {
			if (!test.test(id)) {
				throw error(`${name} must be a number`);
			}
		}

		if (isNaN(id)) {
			throw error(`${name} is incorrect`);
		}

		return id;
	};
})();

function isEmpty(value) {
	return [undefined, null, ''].indexOf(value) > -1;
}


function lang(language) {
	return isEmpty(language) ? DEFAULT_LANG : language;
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

exports.url = makeUrl;
exports.file = makeFileName;
exports.parseNum = parseNum;
exports.lang = lang;
exports.isEmpty = isEmpty;
exports.error = error;
