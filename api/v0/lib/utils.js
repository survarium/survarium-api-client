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

var parseNum = (function () {
	let test = /^\d+$/;
	/**
	 * There is no converting to Number because of UInt
	 */
	return function parseNum(id) {
		if ([undefined, null].indexOf(id) > -1) {
			throw new Error('no id received');
		}

		if (typeof id !== 'number') {
			if (!test.test(id)) {
				throw new Error('id must be a number');
			}
		}

		if (isNaN(id)) {
			throw new Error('id is incorrect');
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

module.exports.url = makeUrl;
module.exports.parseNum = parseNum;
module.exports.lang = lang;
module.exports.isEmpty = isEmpty;
