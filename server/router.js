'use strict';

var router = require('express').Router();

router.get('/', function (req, res) {
	res.json({
		api: req.protocol +
		'://' +
		req.hostname +
		'/v1'
	});
});

router.use('/v1', require('./v1/router'));

router.use(require('./middleware/errors'));

module.exports = router;
