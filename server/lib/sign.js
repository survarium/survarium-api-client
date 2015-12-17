"use strict";

const crypto = require('crypto');
const qs     = require('querystring');

const config = require('../configs');
const utils	 = require('./utils');

function Sign(params) {
	let salt = utils.salt;
	let ts   = utils.ts;

	var signature = crypto.createHmac('sha1', config.keys.private);
	signature.update(params.url + params.method + salt + ts);

	this.signature = signature.digest('base64');

	let headers = this.headers = {
		surv_consumer_key: config.keys.public,
		surv_nonce: salt,
		surv_signature: this.signature,
		surv_signature_method: 'HMAC-SHA1',
		surv_timestamp: ts
	};

	this.header = 'OAuth  ' + Object.keys(headers).map(function (key) {
			return qs.escape(key) + '="' + qs.escape(headers[key]) + '"';
		}).join(', ');
}

module.exports = Sign;
