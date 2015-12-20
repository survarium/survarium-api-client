'use strict';

const test = require('tape');

const api  = new (require('../../').v0)({
	keyPriv: process.env.KEY_PRIV || 'test',
	keyPub : process.env.KEY_PUB  || 'test'
});

test('api:v0:getMaxMatchId', function (t) {
	api
		.getMaxMatchId()
		.then(t.ok)
		.catch(t.fail)
		.then(t.end);
});

test('api:v0:getPublicIdByNickname', function (t) {
	t.plan(3);

	api
		.getPublicIdByNickname()
		.then(t.fail)
		.catch(t.ok);

	api
		.getPublicIdByNickname({ nickname: 'vaseker' })
		.then(function (result) {
			t.equal(result.nickname, 'vaseker', 'should be proper nickname');
			t.equal(result.pid,      '15238791817735151910', 'should be proper PID');
		})
		.catch(t.fail.bind(null, 'should get user information'));
});

test('api:v0:getNicknamesByPublicIds', function (t) {
	t.plan(4);

	var players = {
		'1606615321417388317': 'Dima',
		'15238791817735151910': 'Vaseker'
	};

	var pids = Object.keys(players);

	api
		.getNicknamesByPublicIds({ pids: pids })
		.then(function (result) {
			pids.forEach(function (pid) {
				t.equal(result.nicknames[pid].toLocaleLowerCase(), players[pid].toLocaleLowerCase(), 'should be correct nickname');
			});
		})
		.catch(t.fail.bind(null, 'should get nicknames of pids array'));

	api.getNicknamesByPublicIds()
		.then(t.fail)
		.catch(t.pass.bind(null, 'should reject without pids'));

	var pid = pids[0];
	api.getNicknamesByPublicIds({ pids: pid })
		.then(function (result) {
			t.equal(result.nicknames[pid].toLocaleLowerCase(), players[pid].toLocaleLowerCase(), 'should be correct nickname');
		})
		.catch(t.fail.bind(null, 'should get nickname of one pid'));
});

test('api:v0:matchesCountByPublicId', function (t) {
	t.plan(3);

	api
		.matchesCountByPublicId()
		.then(t.fail.bind(null, 'should reject without pid'))
		.catch(t.pass.bind(null, 'should reject without pid'));

	var pid = '15238791817735151910';
	api
		.matchesCountByPublicId({ pid: pid })
		.then(function (result) {
			t.equal(result.pid, pid, 'should be equal pid');
			t.ok(Number(result.matches_count) >= 1290, 'should be proper number of matches');
		})
		.catch(t.fail.bind(null, 'should get matches count by pid'))
});

test('api:v0:getMatchesIdByPublicId', function (t) {
	t.plan(3);

	api
		.getMatchesIdByPublicId()
		.then(t.fail.bind(null, 'should reject without pid'))
		.catch(t.pass.bind(null, 'should reject without pid'));

	var pid = '15238791817735151910';
	api
		.getMatchesIdByPublicId({ pid: pid })
		.then(function (result) {
			t.equal(result.pid, pid, 'should be equal pid');
			t.ok(Object.keys(result.matches_ids).length === 10, 'should be proper number of matches');
		})
		.catch(t.fail.bind(null, 'should get matches by pid'))
});

test('api:v0:getMatchStatistic', function (t) {
	t.plan(2);

	api
		.getMatchStatistic()
		.then(t.fail.bind(null, 'should reject without id'))
		.catch(t.pass.bind(null, 'should reject without id'));

	var id = '3578606';
	api
		.getMatchStatistic({ id: id })
		.then(function (result) {
			t.equal(result.match_id, id, 'should be equal id');
		})
		.catch(t.fail.bind(null, 'should get matches by pid'))
});

test('api:v0:getUserData', function (t) {
	t.plan(10);

	api
		.getUserData()
		.then(t.fail.bind(null, 'should reject without pid'))
		.catch(t.pass.bind(null, 'should reject without pid'));

	var pid = '15238791817735151910';
	api
		.getUserData({ pid: pid })
		.then(function (result) {
			var data = result.userdata;

			t.equal(result.pid, pid, 'should be equal pid');
			t.equal(data.nickname.toLowerCase(), 'vaseker', 'shoud be correct user');

			t.ok(data.progress, 'should be progress');
			t.ok(data.ammunition, 'should be ammunition');
			t.ok(data.matches_stats, 'should be matches_stats');

			t.ok(Number(data.progress.level) >= 70, 'should be proper level');
			t.ok(Number(data.matches_stats.matches) >= 1115, 'should be proper matches amount');
			t.ok(Number(data.matches_stats.kills) >= 18686, 'should be proper kills amount');
			t.ok(Number(data.matches_stats.dies) >= 9446, 'should be proper dies amount');
		})
		.catch(t.fail.bind(null, 'should get user data by pid'))
});

test('api:v0:getClanAmounts', function (t) {
	t.plan(1);

	api
		.getClanAmounts()
		.then(function (result) {
			t.equal(typeof result.amount, 'number', 'should be amount of clans');
		})
		.catch(t.fail.bind(null, 'should be amount of clans'));
});

test('api:v0:getClans', function (t) {
	t.plan(6);

	api
		.getClans()
		.then(function (result) {
			t.ok(result.clans_data, 'should be data');
			t.ok(Object.keys(result.clans_data).length <= 10, 'should return amount of entities lte default limit');
			t.ok(result.offset === '0', 'should be paginated from start');
		})
		.catch(t.fail.bind(null, 'should get clans list'));

	api
		.getClans({ amount: 100, offset: 50 })
		.then(function (result) {
			t.ok(result.clans_data, 'should be paginated data');
			t.ok(Object.keys(result.clans_data).length <= 25, 'should return amount of entities lte 25 limit');
			t.ok(result.offset === '50', 'should be paginated from start');
		})
		.catch(t.fail.bind(null, 'should get paginated clans list'));
});

test('api:v0:getClanInfo', function (t) {
	t.plan(7);

	api
		.getClanInfo()
		.then(t.fail.bind(null, 'shoud reject without params'))
		.catch(t.pass.bind(null, 'shoud reject without params'));

	api
		.getClanInfo({ id: 2 })
		.then(function (result) {
			var info = result.clan_info;
			t.equal(Number(info.id), 2);
			t.ok(info.name, 'should be clan full name');
			t.ok(info.abbreviation, 'should be clan abbr');
			t.ok(info.level, 'should be clan level');
			t.ok(info.elo, 'should be clan elo');
			t.ok(info.commander_pid, 'should be commander pid');
		})
		.catch(t.fail.bind(null, 'should get clan info'));
});

test('api:v0:getClanMembers', function (t) {
	t.plan(5);

	api
		.getClanMembers()
		.then(t.fail.bind(null, 'shoud reject without params'))
		.catch(t.pass.bind(null, 'shoud reject without params'));

	api
		.getClanMembers({ id: 2 })
		.then(function (result) {
			t.equal(result.clan_id, 2);
			t.ok(result.members, 'should be members list');
			t.ok(result.members[0].pid, 'should be member\'s pid');
			t.ok(result.members[0].role_name, 'should be member\'s role');
		})
		.catch(t.fail.bind(null, 'should get clan members list'));
});

test('api:v0:getSlotsDict', function (t) {
	t.plan(1);

	api
		.getSlotsDict({ language: 'russian' })
		.then(function (result) {
			t.ok(result.dictionary, 'should get data');
		})
		.catch(t.fail.bind(null, 'should get slots dictionary'));
});

test('api:v0:getItemsDict', function (t) {
	t.plan(1);

	api
		.getItemsDict({ language: 'russian' })
		.then(function (result) {
			t.ok(result.dictionary, 'should get data');
		})
		.catch(t.fail.bind(null, 'should get items dictionary'));
});

test('api:v0:getMapsDict', function (t) {
	t.plan(1);

	api
		.getMapsDict()
		.then(function (result) {
			t.ok(result.dictionary, 'should get data');
		})
		.catch(t.fail.bind(null, 'should get maps dictionary'));
});
