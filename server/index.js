#!/usr/bin/env node

'use strict';

process.chdir(__dirname);

const config  = require('./configs');
const cluster = require('cluster');

cluster.setupMaster({
	exec: './worker.js',
	args: process.argv
});

for (var i = 0; i < config.workers; i++) {
	cluster.fork();
}
