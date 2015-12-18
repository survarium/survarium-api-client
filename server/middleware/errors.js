var config = require('../configs');

module.exports = function (err, req, res, next) {
	if (err) {
		res.status(500);
		console.error(new Date(), req.ip, req.path);
		if (config.env !== 'production') {
			console.error(err.stack);
		}
		return res.send(err.message);
	}
	return next();
};
