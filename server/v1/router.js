'use strict';

var router = require('express').Router();

var index = require('./controllers');

router.get('/', index.index);
router.get('/cmd/:cmd', index.cmd);

module.exports = router;
