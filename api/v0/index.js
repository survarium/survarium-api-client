'use strict';

const Promise  = require('bluebird');
const handlers = require('./handlers');
const Sign     = require('./lib/sign');
const ask      = require('./lib/ask');
const debug    = require('debug')('survarium-api-client');

var Stack = function (options) {
	this.stack = [];
	this.currentOp = null;
	this.retriesLimit = options.retries;
	this.pause = options.interval;
};

Stack.prototype.add = function (fn, opts) {
	var self = this;
	opts = opts || {};
	var retry = opts.retry || 0;
	return new Promise(function (resolve, reject) {
		self.stack[opts.method || 'push'](function () {
			return fn({ retries: 0 })
			.then(function (result) {
				self.currentOp = null;
				return self.move(null, result);
			})
			.then(resolve)
			.catch(function (err) {
				self.currentOp = null;
				if (!ask.retryAllowed(++retry, self.retriesLimit, err)) {
					self.move();
					return reject(err);
				}
				debug(`retry #${retry} [${err.statusCode}] for ${opts.query.method}:${JSON.stringify(opts.query.params)}`);
				return self
					.add(fn, { retry: retry, method: 'unshift', query: opts.query })
					.then(resolve)
					.catch(reject);
			});
		});
		self.move();
	});
};

Stack.prototype.move = function (err, result) {
	var self = this;
	if (!self.currentOp && self.stack.length) {
		self.currentOp = setTimeout(function () {
			self.stack.shift()();
		}, self.pause);
	}
	if (err) {
		throw err;
	}
	return result;
};

/**
 * API client constructor
 * @param {Object} [params]
 * @param {String} [params.keyPub=test]                   Public API key
 * @param {String} [params.keyPriv=test]                  Private API key
 * @param {String} [params.api=http://api.survarium.com/] API address
 * @param {Object} [options]
 * @param {Number} [options.retries=10]                   Amount of retries
 * @param {Number} [options.stackInterval=20]             Pause in stack (ms)
 * @constructor
*/
var Api = function (params, options) {
	params = params || {};
	this.options = options || {};
	this.keyPub  = params.keyPub  || 'test';
	this.keyPriv = params.keyPriv || 'test';
	this.api     = params.api     || 'http://api.survarium.com/';
	this.stack   = new Stack({
		retries : this.options.retries || 10,
		interval: this.options.stackInterval || 20
	});

	this.__handlers = handlers;

	this._sign = new Sign({ keyPriv: this.keyPriv, keyPub: this.keyPub });
};

/**
 * Query executor
 * @param {String}  method                  API method name
 * @param {Object}  [args]                  Execution arguments
 * @param {Object}  [args.0]                API query params
 * @param {Object}  [args.1]                Quering options
 * @param {Object}  [args.1.delay]          delay in ms before executing query
 * @param {Boolean} [args.1.stack]          run query in stack-mode
 * @param {String}  [args.1.saveSource]     save response json to provided path
 * @returns {function(ask)}
 * @private
 */
Api.prototype.wrap = function (method, args) {
	var params  = args[0];
	var options = args[1] || {};
	var self = this;
	var exec = function (opts) {
		return self.__handlers[method].call(self, params).then(function (query) {
			return ask.call(self, query, Object.assign({
				saveSource: options.saveSource,
				retries: options.retries
			}, opts || {}));
		});
	};
	if (options.delay) {
		return Promise.delay(options.delay).then(exec);
	}
	if (options.stack) {
		return this.stack.add.call(self.stack, exec, { pause: options.stackPause, query: {
			method: method,
			params: params
		} });
	}
	return exec();
};

/**
 * Получить последний сыгранный в Survarium match_id.
 *
 * Return max match_id played in Survarium.
 *
 * param pid - not implemented and hasn't been ported // TODO: investigate getMaxMatchId(pid)
 * @returns {Promise}
*/
Api.prototype.getMaxMatchId = function () {
	return this.wrap.call(this, 'getMaxMatchId', arguments);
};

/**
 * Получить PID игрока по его никнейму.
 *
 * Return users public account id by nickname.
 *
 * @param   {Object}  params
 * @param   {String}  params.nickname Player nickname
 * @returns {Promise}
 */
Api.prototype.getPublicIdByNickname = function (params) {
	return this.wrap.call(this, 'getPublicIdByNickname', arguments);
};

/**
 * Получить список никнеймов по массиву PID.
 *
 * Return bunch of nicknames by array of public account ids.
 *
 * @param   {Object}       params
 * @param   {Array|String} params.pids Array of public ids or one PID
 * @returns {Promise}
 */
Api.prototype.getNicknamesByPublicIds = function (params) {
	return this.wrap.call(this, 'getNicknamesByPublicIds', arguments);
};

/**
 * Получить суммарное количество сыгранных матчей указанным PID.
 *
 * Retrieve amount of played matches by user whose public account Id equals pid.
 *
 * @param   {Object}  params
 * @param   {String}  params.pid  Public player ID
 * @returns {Promise}
 */
Api.prototype.matchesCountByPublicId = function (params) {
	return this.wrap.call(this, 'matchesCountByPublicId', arguments);
};

/**
 * Получить paginated список сыгранных матчей по PID игрока.
 *
 * Return particular amount of played matches of user with public account id = pid.
 *
 * @param   {Object}  params
 * @param   {String}  params.pid                 Public player ID
 * @param   {Number}  [params.matchAmount=10]    Amount of matches to return (limited by 25)
 * @param   {Number}  [params.offset=0]          Amount of entries to skip
 * @returns {Promise}
 */
Api.prototype.getMatchesIdByPublicId = function (params) {
	return this.wrap.call(this, 'getMatchesIdByPublicId', arguments);
};

/**
 * Получить статистику матча по его ID.
 *
 * Return statistic of particular match by match_id.
 *
 * @param   {Object}   params
 * @param   {Number}   params.id                   Match ID
 * @param   {String}   [params.language=english]   Results language
 * @returns {Promise}
 */
Api.prototype.getMatchStatistic = function (params) {
	return this.wrap.call(this, 'getMatchStatistic', arguments);
};

/**
 * Получить информацию об игроке: рейтинг, инвентарь по PID.
 *
 * Return all user data: rating, inventory.
 *
 * @param   {Object}   params
 * @param   {String}   params.pid                  Player ID
 * @param   {String}   [params.language=english]   Results language
 * @returns {Promise}
 */
Api.prototype.getUserData = function (params) {
	return this.wrap.call(this, 'getUserData', arguments);
};

/**
 * Получить информацию о прокачке игрока.
 *
 * Return user skill points.
 *
 * @param   {Object}   params
 * @param   {String}   params.pid                  Player ID
 * @returns {Promise}
 */
Api.prototype.getUserSkills = function (params) {
	return this.wrap.call(this, 'getUserSkills', arguments);
};

/**
 * Получить количество активных кланов в Survarium.
 *
 * Return amount of active clans in Survarium.
 * @returns {Promise}
 */
Api.prototype.getClanAmounts = function () {
	return this.wrap.call(this, 'getClanAmounts', arguments);
};

/**
 * Получить paginated список кланов, сортированных по ELO рейтингу (от большего к меньшему).
 *
 * Return list of the clan ids and names ordered by elo rating (begin from the top).
 *
 * @param   {Object}   params
 * @param   {Number}   [params.amount=10]      Amount of clans to fetch (limited by 25)
 * @param   {Number}   [params.offset=0]       Amount of skipped entities
 * @returns {Promise}
 */
Api.prototype.getClans = function (params) {
	return this.wrap.call(this, 'getClans', arguments);
};

/**
 * Получить информацию о клане по его ID (название, тег, уровень, рейтинг, PID командира).
 *
 * Return name, abbr, level, elo rating and pid of clan commander.
 *
 * @param   {Object}   params
 * @param   {Number}   params.id   ID of clan
 * @returns {Promise}
 */
Api.prototype.getClanInfo = function (params) {
	return this.wrap.call(this, 'getClanInfo', arguments);
};

/**
 * Получить список участников клана с их званиями.
 *
 * Return members of given clan with their roles.
 *
 * @param   {Object}   params
 * @param   {Number}   params.id       ID of clan
 * @returns {Promise}
 */
Api.prototype.getClanMembers = function (params) {
	return this.wrap.call(this, 'getClanMembers', arguments);
};

/**
 * Получить лимитированный список матчей, прошедших с заданной даты.
 *
 * Return limited matches list after timestamp.
 *
 * @param   {Object}   params
 * @param   {Number}   params.timestamp        Timestamp to search from
 * @param   {Number}   [params.limit=50]       Amount of matches to fetch
 * @param   {Number}   [params.offset=50]      Amount of matches to skip
 * @returns {Promise}
 */
Api.prototype.getNewMatches = function (params) {
	return this.wrap.call(this, 'getNewMatches', arguments);
};

/**
 * Получить словарь игровых слотов.
 *
 * Return game slots dictionary.
 *
 * @param   {Object}   [params]
 * @param   {String}   [params.language=english]   Dictionary language
 * @returns {Promise}
 */
Api.prototype.getSlotsDict = function (params) {
	return this.wrap.call(this, 'getSlotsDict', arguments);
};

/**
 * Получить словарь игровых предметов.
 *
 * Return game items dictionary.
 *
 * @param   {Object}   [params]
 * @param   {String}   [params.language=english]   Dictionary language
 * @returns {Promise}
 */
Api.prototype.getItemsDict = function (params) {
	return this.wrap.call(this, 'getItemsDict', arguments);
};

/**
 * Получить словарь карт.
 *
 * Return game maps dictionary.
 *
 * @param   {Object}   [params]
 * @param   {String}   [params.language=english]   Dictionary language
 * @returns {Promise}
 */
Api.prototype.getMapsDict = function (params) {
	return this.wrap.call(this, 'getMapsDict', arguments);
};

module.exports = Api;
