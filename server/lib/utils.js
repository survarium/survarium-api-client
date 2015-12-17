const crypto = require('crypto');

/**
 * Generate random string for signature
 *
 * @return string
 */
function generateSalt() {
	var salt = crypto.createHash('md5');
	salt.update(Math.rand() + ts());
    return salt.digest('hex');
}

function ts() {
	return Date.now() / 1000 >>> 0;
}

Object.defineProperties(module.exports, {
	{
		'salt': {
			get: generateSalt,
			enumerable: true,
			writable: false
		},
		ts: {
			get: ts,
			enumerable: true,
			writable: false
		}
	}
});
