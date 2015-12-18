'use strict';

const Promise = require('bluebird');
const utils   = require('../../../lib/utils');

/**
 * Получить последний сыгранный в Survarium match_id.
 *
 * Return max match_id played in Survarium.
 *
 * param pid - not implemented and hasn't been ported // TODO: investigate getMaxMatchId(pid)
 */
exports.getMaxMatchId = function () {
	return new Promise(function (resolve) {
		return resolve({
			path: 'getmaxmatchid'
		});
	});
};

/**
 * Получить PID игрока по его никнейму.
 *
 * Return users public account id by nickname.
 *
 * @param {String} nickname Player nickname
 */
exports.getPublicIdByNickname = function (nickname) {
	return new Promise(function (resolve, reject) {
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

/**
 * Получить список никнеймов по массиву PID.
 *
 * Return bunch of nicknames by array of public account ids.
 *
 * @param {Array|String} pids Array of public ids or one PID
 */
exports.getNicknamesByPublicIds = function (pids) {
	return new Promise(function (resolve, reject) {
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

/**
 * Получить суммарное количество сыгранных матчей указанным PID.
 *
 * Retrieve amount of played matches by user whose public account Id equals pid.
 *
 * @param {String} pid  Public player ID
 */
exports.matchesCountByPublicId = function (pid) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getmatchescountbypid',
			query: {
				pid: utils.parseNum(pid)
			}
		});
	});
};

/**
 * Получить paginated список сыгранных матчей по PID игрока.
 *
 * Return particular amount of played matches of user with public account id = pid.
 *
 * @param  {String} pid                 Public player ID
 * @param  {Number} [matchAmount=10]    Amount of matches to return (limited by 25)
 * @param  {Number} [offset=0]          Amount of entries to skip
 */
exports.getMatchesIdByPublicId = function (pid, matchAmount, offset) {
	return new Promise(function (resolve) {
		matchAmount = matchAmount === undefined ? 10 : utils.parseNum(matchAmount);
		offset      = offset === undefined ? 0 : utils.parseNum(offset);

		return resolve({
			path : 'getmatchesidbypublicid',
			query: {
				pid        : utils.parseNum(pid),
				matchAmount: matchAmount,
				offset     : offset
			}
		});
	});
};

/**
 * Получить статистику матча по его ID.
 *
 * Return statistic of particular match by match_id.
 *
 * @param {Number} matchId              Match ID
 * @param {String} [language=english]   Results language
 */
exports.getMatchStatistic = function (matchId, language) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getmatchstatisticbyid',
			query: {
				matchid : utils.parseNum(matchId),
				language: utils.lang(language)
			}
		});
	});
};

/**
 * Получить информацию об игроке: рейтинг, инвентарь по PID.
 *
 * Return all user data: rating, inventory.
 *
 * @param {String} pid                  Player ID
 * @param {String} [language=english]   Results language
 */
exports.getUserData = function (pid, language) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getuserdatabypid',
			query: {
				pid     : utils.parseNum(pid),
				language: utils.lang(language)
			}
		});
	});
};

/**
 * Получить количество активных кланов в Survarium.
 *
 * Return amount of active clans in Survarium.
 */
exports.getClanAmounts = function () {
	return new Promise(function (resolve) {
		return resolve({
			path: 'getclansamount'
		});
	});
};

/**
 * Получить paginated список кланов, сортированных по ELO рейтингу (от большего к меньшему).
 *
 * Return list of the clan ids and names ordered by elo rating (begin from the top).
 *
 * @param {Number} [amount=10]      Amount of clans to fetch (limited by 25)
 * @param {Number} [offset=0]       Amount of skipped entities
 */
exports.getClans = function (amount, offset) {
	return new Promise(function (resolve) {
		amount = amount === undefined ? 10 : utils.parseNum(amount);
		offset = offset === undefined ? 0  : utils.parseNum(offset);

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
 * Получить информацию о клане по его ID (название, тег, уровень, рейтинг, PID командира).
 *
 * Return name, abbr, level, elo rating and pid of clan commander.
 *
 * @param {Number} clanId   ID of clan
 */
exports.getClanInfo = function (clanId) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getclaninfo',
			query: {
				clanid: utils.parseNum(clanId)
			}
		});
	});
};

/**
 * Получить список участников клана с их званиями.
 *
 * Return members of given clan with their roles.
 *
 * @param {Number} clanId       ID of clan
 */
exports.getClanMembers = function (clanId) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getclanmembers',
			query: {
				clanid: utils.parseNum(clanId)
			}
		});
	});
};

/**
 * Получить словарь игровых слотов.
 *
 * Return game slots dictionary.
 *
 * @param {String} [language=english]   Dictionary language
 */
exports.getSlotsDict = function (language) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getslotsdict',
			query: {
				language: utils.lang(language)
			}
		});
	});
};

/**
 * Получить словарь игровых предметов.
 *
 * Return game items dictionary.
 *
 * @param {String} [language=english]   Dictionary language
 */
exports.getItemsDict = function (language) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getitemsdict',
			query: {
				language: utils.lang(language)
			}
		});
	});
};

/**
 * Получить словарь карт.
 *
 * Return game maps dictionary.
 *
 * @param {String} [language=english]   Dictionary language
 */
exports.getMapsDict = function (language) {
	return new Promise(function (resolve) {
		return resolve({
			path : 'getmapsdict',
			query: {
				language: utils.lang(language)
			}
		});
	});
};
