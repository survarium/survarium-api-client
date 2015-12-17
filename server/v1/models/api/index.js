'use strict';

const got = require('got');

const handlers = require('./handlers');
const Sign     = require('../../../lib/sign');
const utils    = require('../../../lib/utils');

exports.handlers = handlers;

exports.ask = function (params) {
	var url = utils.url(params);
	var method = 'GET';

	var auth = new Sign({
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
		});
};
