#!/usr/bin/env node

'use strict';

process.chdir(__dirname);

const config  = require('./configs');
const cluster = require('cluster');

cluster.setupMaster({
	exec: './worker.js',
	args: process.argv
});

(function cleanupSocket(socket) {
	if (socket && !(/^\d+$/.exec(socket))) {
		require('mkdirp').sync(path.dirname(socket));

		if (fs.existsSync(socket)) {
			fs.unlinkSync(socket);
		}
	}
	return socket;
})(config.handle);

for (var i = 0; i < config.workers; i++) {
	cluster.fork();
}
