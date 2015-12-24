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
			return reject(new Error('no params received'));
		}

		var nickname = params.nickname;

		if (utils.isEmpty(nickname)) {
			return reject(new Error('no nickname received'));
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
			return reject(new Error('no params received'));
		}

		var pids = params.pids;

		if (!pids) {
			return reject(new Error('no pids received'));
		}

		if (!(pids instanceof Array)) {
			pids = [pids];
		}

		if (!pids.length) {
			return reject(new Error('should be received at least one pid'));
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
	return new Promise(function (resolve) {
		if (!params) {
			return reject(new Error('no params received'));
		}

		var pid = utils.parseNum(params.pid);

		if (!pid) {
			return reject(new Error('no pid received'));
		}

		return resolve({
			path : 'getmatchescountbypid',
			query: {
				pid: pid
			}
		});
	});
};

exports.getMatchesIdByPublicId = function (params) {
	return new Promise(function (resolve) {
		if (!params) {
			return reject(new Error('no params received'));
		}

		var pid = utils.parseNum(params.pid);

		if (!pid) {
			return reject(new Error('no pid received'))
		}

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
	return new Promise(function (resolve) {
		if (!params) {
			return reject(new Error('no params received'));
		}

		var id = utils.parseNum(params.id);

		if (!id) {
			return reject(new Error('no id received'))
		}

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
	return new Promise(function (resolve) {
		if (!params) {
			return reject(new Error('no params received'));
		}

		var pid = utils.parseNum(params.pid);

		if (!pid) {
			return reject(new Error('no pid received'))
		}

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
	return new Promise(function (resolve) {
		if (!params) {
			return reject(new Error('no params received'));
		}

		var id = utils.parseNum(params.id);

		if (!id) {
			return reject(new Error('no id received'))
		}

		return resolve({
			path : 'getclaninfo',
			query: {
				clanid: id
			}
		});
	});
};

exports.getClanMembers = function (params) {
	return new Promise(function (resolve) {
		if (!params) {
			return reject(new Error('no params received'));
		}

		var id = utils.parseNum(params.id);

		if (!id) {
			return reject(new Error('no id received'))
		}

		return resolve({
			path : 'getclanmembers',
			query: {
				clanid: id
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
