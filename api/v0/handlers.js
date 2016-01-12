'use strict';

const Promise = require('bluebird');
const utils   = require('./lib/utils');

exports.getMaxMatchId = function () {
	return new Promise(function (resolve) {
		return resolve({
			path: 'getmaxmatchid'
		});
	});
};

exports.getPublicIdByNickname = function (params) {
	return new Promise(function (resolve, reject) {
		if (!params) {
			return reject(utils.error('no params received'));
		}

		var nickname = params.nickname;

		if (utils.isEmpty(nickname)) {
			return reject(utils.error('no nickname received'));
		}

		return resolve({
			path : 'getpublicidbynickname',
			query: {
				nickname: nickname
			}
		});
	});
};

exports.getNicknamesByPublicIds = function (params) {
	return new Promise(function (resolve, reject) {
		if (!params) {
			return reject(utils.error('no params received'));
		}

		var pids = params.pids;

		if (!pids) {
			return reject(utils.error('no pids received'));
		}

		if (!(pids instanceof Array)) {
			pids = [pids];
		}

		if (!pids.length) {
			return reject(utils.error('should be received at least one pid'));
		}

		return resolve({
			path : 'getnicknamesbypidarray',
			query: {
				pids: pids.map(utils.parseNum).join(',')
			}
		});
	});
};

exports.matchesCountByPublicId = function (params) {
	return new Promise(function (resolve, reject) {
		if (!params) {
			return reject(utils.error('no params received'));
		}

		var pid = utils.parseNum(params.pid, 'pid');

		return resolve({
			path : 'getmatchescountbypid',
			query: {
				pid: pid
			}
		});
	});
};

exports.getMatchesIdByPublicId = function (params) {
	return new Promise(function (resolve, reject) {
		if (!params) {
			return reject(utils.error('no params received'));
		}

		var pid = utils.parseNum(params.pid, 'pid');

		var matchAmount = params.matchAmount === undefined  ? 10 : utils.parseNum(params.matchAmount);
		var offset      = params.offset === undefined       ? 0  : utils.parseNum(params.offset);

		return resolve({
			path : 'getmatchesidbypublicid',
			query: {
				pid        : pid,
				matchAmount: matchAmount,
				offset     : offset
			}
		});
	});
};

exports.getMatchStatistic = function (params) {
	return new Promise(function (resolve, reject) {
		if (!params) {
			return reject(utils.error('no params received'));
		}

		var id = utils.parseNum(params.id);

		return resolve({
			path : 'getmatchstatisticbyid',
			query: {
				matchid : id,
				language: utils.lang(params.lang)
			}
		});
	});
};

exports.getUserData = function (params) {
	return new Promise(function (resolve, reject) {
		if (!params) {
			return reject(utils.error('no params received'));
		}

		var pid = utils.parseNum(params.pid, 'pid');

		return resolve({
			path : 'getuserdatabypid',
			query: {
				pid     : pid,
				language: utils.lang(params.language)
			}
		});
	});
};

exports.getClanAmounts = function () {
	return new Promise(function (resolve) {
		return resolve({
			path: 'getclansamount'
		});
	});
};

exports.getClans = function (params) {
	return new Promise(function (resolve) {
		params = params || {};
		var amount = params.amount === undefined ? 10 : utils.parseNum(params.amount);
		var offset = params.offset === undefined ? 0  : utils.parseNum(params.offset);

		return resolve({
			path : 'getclans',
			query: {
				amount: amount,
				offset: offset
			}
		});
	});
};

exports.getClanInfo = function (params) {
	return new Promise(function (resolve, reject) {
		if (!params) {
			return reject(utils.error('no params received'));
		}

		var id = utils.parseNum(params.id);

		return resolve({
			path : 'getclaninfo',
			query: {
				clanid: id
			}
		});
	});
};

exports.getClanMembers = function (params) {
	return new Promise(function (resolve, reject) {
		if (!params) {
			return reject(utils.error('no params received'));
		}

		var id = utils.parseNum(params.id);

		return resolve({
			path : 'getclanmembers',
			query: {
				clanid: id
			}
		});
	});
};

exports.getNewMatches = function (params) {
	return new Promise(function (resolve) {
		params = params || {};

		var timestamp = utils.parseNum(params.timestamp, 'timestamp');

		timestamp = String(timestamp);

		if (timestamp.length > 10) {
			timestamp = timestamp.slice(0, 10);
		}

		var limit  = params.limit  === undefined ? 50 : utils.parseNum(params.limit, 'limit');
		var offset = params.offset === undefined ? 0 : utils.parseNum(params.offset, 'offset');

		return resolve({
			path : 'getnewmatchesfrom',
			query: {
				timestamp: timestamp,
				limit: limit,
				offset: offset
			}
		});
	});
};

exports.getSlotsDict = function (params) {
	return new Promise(function (resolve) {
		params = params || {};
		return resolve({
			path : 'getslotsdict',
			query: {
				language: utils.lang(params.language)
			}
		});
	});
};

exports.getItemsDict = function (params) {
	return new Promise(function (resolve) {
		params = params || {};
		return resolve({
			path : 'getitemsdict',
			query: {
				language: utils.lang(params.language)
			}
		});
	});
};

exports.getMapsDict = function (params) {
	return new Promise(function (resolve) {
		params = params || {};
		return resolve({
			path : 'getmapsdict',
			query: {
				language: utils.lang(params.language)
			}
		});
	});
};

exports.getUserSkills = function (params) {
	return new Promise(function (resolve) {
		if (!params) {
			return reject(utils.error('no params received'));
		}

		var pid = utils.parseNum(params.pid, 'pid');
		return resolve({
			path : 'getuserskills',
			query: {
				pid: pid
			}
		});
	});
};
