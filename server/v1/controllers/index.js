'use strict';

const api = require('../models/api');
const handlers = api.handlers;
const handlersNames = Object.keys(handlers);

const index = function (req, res) {
	const baseUrl = req.baseUrl;

	let handlersList = handlersNames.reduce(function (result, method) {
		result[method] = baseUrl + '/cmd/' + method + '/?param1=&param2=';
		return result;
	}, {});

	res.json(handlersList);
};

const cmd = function (req, res, next) {
	let cmd = req.params.cmd;

	if (!handlers[cmd]) {
		return res.status(401).send('no method ' + cmd + ' available');
	}

	let query = req.query;
	let args = Object.keys(query).map(function (key) {
		return query[key];
	});

	handlers
		[cmd].apply(null, args)
		.then(api.ask)
		.then(function (result) {
			let data = result.body;
			res.json(data);
			return data;
		})
		.catch(next);
};

exports.index = index;
exports.cmd = cmd;
