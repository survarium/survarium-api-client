'use strict';

var router = require('express').Router();

router.get('/', require('./controllers').index);

module.exports = router;
