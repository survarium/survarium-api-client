'use strict';

const config = require('./configs');

var express = require('express');
var app = express();

app.disable('x-powered-by');
app.set('env', config.env);

app.use(require('./router'));

app.listen(config.handle, function (err) {
	if (err) {
		throw err;
	}
	console.log('app listening handle', config.handle);
});
