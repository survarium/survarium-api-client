'use strict';

const api = new (require('../').v0)({ keyPriv: 'test', keyPub: 'test' });

api
	.getMaxMatchId(null, { delay: 500 })
	.then(console.log.bind(console, 'latest match is'))
	.catch(console.error.bind(console, 'fail while getting max match'));

api
	.getPublicIdByNickname({ nickname: 'vaseker' }, { delay: 300 })
	.then(console.log.bind(console, 'vaseker\'s PID is'));

api
	.getMatchStatistic({ id: '3585243' }, { delay: 200 })
	.then(console.log.bind(console, 'match info'));
