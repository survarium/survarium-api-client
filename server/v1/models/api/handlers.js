'use strict';

const Promise = require('bluebird');

/**
 * Return max match_id played in Survarium
 * param pid - not implemented and not ported // TODO: investigate getMaxMatchId(pid)
 */
exports.getMaxMatchId = function () {
	return new Promise(function (resolve) {
		return resolve({
			path: 'getmaxmatchid'
		});
	});
};

/**
 * Return users public account id by $nickname
 *
 * @param {String} nickname
 */
exports.getPublicIdByNickname = function (nickname) {
	return new Promise(function (resolve, reject) {
		if (!nickname) {
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

/**
 * Return bunch of nicknames by array of public account ids
 *
 * @param {Array} pids
 */
exports.getNicknamesByPublicIds = function (pids) {
	return new Promise(function (resolve, reject) {
		if (!pids) {
			return reject(new Error('no pids received'));
		}

		if (!pids.length) {
			return reject(new Error('should be received at least one pid'));
		}

		return resolve({
			path : 'getnicknamesbypidarray',
			query: {
				pids: pids.join(',')
			}
		});
	});
};

/**
 * Retrieve amount of played matches by  user whose public account Id equals $pid
 *
 * @param  pid
 */
exports.matchesCountByPublicId = function (pid) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getmatchescountbypid',
			query: {
				pid: pid
			}
		});
	});
};

/**
 * Return particular amount of played matches of user with public account id = $pid
 *
 * @param  {String} pid
 * @param  matchAmount
 * @param  offset - offset from last played match ( by default 0 )
 */
exports.getMatchesIdByPublicId = function (pid, matchAmount, offset) {
	return new Promise(function (resolve) {
		matchAmount = matchAmount === undefined ? 10 : matchAmount;
		offset      = offset === undefined ? 0 : offset;

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

/**
 * Return statistic of particular match by match_id
 *
 * @param {Number} matchId
 * @param {String} [language]
 */
exports.getMatchStatistic = function (matchId, language) {
	return new Promise(function (resolve) {
		language = language === undefined ? 'english' : language;

		return resolve({
			path : 'getmatchstatisticbyid',
			query: {
				matchid : matchId,
				language: language
			}
		});
	});
};

/**
 * Return all users data
 *
 * @param {String} pid
 * @param {String} [language]
 */
exports.getUserData = function (pid, language) {
	return new Promise(function (resolve, reject) {
		language = language === undefined ? 'english' : language;

		return resolve({
			path : 'getuserdatabypid',
			query: {
				pid     : pid,
				language: language
			}
		});
	});
};

/**
 * Return amount of active clans in Survarium
 */
exports.getClanAmounts = function () {
	return new Promise(function (resolve) {
		return resolve({
			path: 'getclansamount'
		});
	});
};

/**
 * Return list of the clan ids and names ordered by elo rating (begin from the top)
 *
 * @param amount
 * @param offset
 */
exports.getClans = function (amount, offset) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getclans',
			query: {
				amount: amount,
				offset: offset
			}
		});
	});
};

/**
 * Return name, abbr, level. elo rating and pid of clan commander
 *
 * @param clanId
 */
exports.getClanInfo = function (clanId) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getclaninfo',
			query: {
				clanid: clanId
			}
		});
	});
};

/**
 * Return members of given clan with their roles
 *
 * @param clanId
 */
exports.getClanMembers = function (clanId) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getclanmembers',
			query: {
				clanid: clanId
			}
		});
	});
};

/**
 * @param language
 */
exports.getSlotsDict = function (language) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getslotsdict',
			query: {
				language: language
			}
		});
	});
};

/**
 * @param language
 */
exports.getItemsDict = function (language) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getitemsdict',
			query: {
				language: language
			}
		});
	});
};

exports.getMapsDict = function (language) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getmapsdict',
			query: {
				language: language
			}
		});
	});
};
