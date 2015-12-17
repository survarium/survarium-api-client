'use strict';

var api = require('../models/api');

var index = function (req, res, next) {
	api
		.handlers
		.getPublicIdByNickname('vaseker')
		.then(api.ask)
		.then(function (result) {
			let data = result.body;
			res.json(data);
			return data;
		})
		.catch(next);
};

exports.index = index;
