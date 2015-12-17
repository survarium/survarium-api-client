var config = require('../configs');

module.exports = function (err, req, res, next) {
	if (err) {
		res.status(503);
		if (config.env !== 'production') {
			console.error(req.path, err.stack);
			return res.send(err.message);
		}
		return res.end();
	}
	return next();
};
