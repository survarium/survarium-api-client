"use strict";

const crypto = require('crypto');
const qs     = require('querystring');

const utils	 = require('./utils');

function Sign(params) {
	this.keyPriv = params.keyPriv;
	this.keyPub  = params.keyPub;
}

Sign.prototype.make = function (params) {
	let salt = utils.salt;
	let ts   = utils.ts;

	let signature = crypto.createHmac('sha1', this.keyPriv);
	signature.update(params.url + params.method + salt + ts);

	let sign = signature.digest('base64');

	let headers = this.headers = {
		surv_consumer_key: this.keyPub,
		surv_nonce: salt,
		surv_signature: sign,
		surv_signature_method: 'HMAC-SHA1',
		surv_timestamp: ts
	};

	return {
		header: 'OAuth  ' + Object.keys(headers).map(function (key) {
			return qs.escape(key) + '="' + qs.escape(headers[key]) + '"';
		}).join(', '),
		signature: sign
	};
};

module.exports = Sign;
