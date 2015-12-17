'use strict';

const path   = require('path');
const fs     = require('fs');
const config = require('./configs');

var express = require('express');
var app = express();

app.set('env', config.env);
app.disable('x-powered-by');
app.enable('trust proxy');

app.use(require('./router'));

var handle = (function cleanupSocket(socket) {
	if (socket && !(/^\d+$/.exec(socket))) {
		require('mkdirp').sync(path.dirname(socket));

		if (fs.existsSync(socket)) {
			fs.unlinkSync(socket);
		}
	}
	return socket;
})(config.handle);

app.listen(handle, function (err) {
	if (err) {
		throw err;
	}
	console.log('app listening handle', handle);
});
