'use strict';

var router = require('express').Router();

router.use(require('morgan')('dev')/*(':remote-addr :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"')*/);

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
