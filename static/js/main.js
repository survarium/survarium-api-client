'use strict';

(function (config) {
	var language = config.storage.get(config.langStorageKey);
	config.language = config.languages.indexOf(language) > -1 ?
		language : config.languages[0];

	$(document).ready(function () {

		var main = $('#main');

		var api = (function ($, config) {
			$.ajaxSetup({
				dataType: 'json',
				timeout: 5 * 1000,
				error: function (err) {
					console.error(err.responseJSON || err);
				}
			});

			return {
				maxMatch: function () {
					return $.ajax(config.api + '/getMaxMatchId')
						.then(function (result) {
							return result.max_match_id.api;
						});
				},
				matchInfo: function (id) {
					return $.ajax(config.api + '/getMatchStatistic', {
							data: {
								id: id,
								lang: config.language
							}
						})
						.then(function (result) {
							return {
								id: result.match_id,
								stats: result.stats
							};
						});
				},
				getNickNames: function (ids) {
					return $.ajax(config.api + '/getNicknamesByPublicIds', {
							data: {
								ids: ids
							}
						})
						.then(function (result) {
							return result.nicknames;
						});
				}
			};
		})($, config);

		var kdRatio = function (kill, die) {
			return die ?
				kill ? (kill / die).toFixed(1) :
					-die:
				kill;
		};

		var MatchResults = (function (params) {
			var i18n = {
				russian: {
					title: 'Результаты',
					team: 'Команда',
					nickname: 'Имя',
					kills: 'Убийств',
					died: 'Смертей',
					kdRatio: 'K/D',
					score: 'Счет'
				},
				english: {
					title: 'Results',
					team: 'Team',
					nickname: 'Nickname',
					kills: 'Kills',
					died: 'Deaths',
					kdRatio: 'K/D',
					score: 'Score'
				}
			}[params.language];

			var tpl = function (data, nicknames) {
				var teams = data.stats.accounts;
				var result = ['0', '1'].map(function (teamNum) {
					var team = teams[teamNum];

					if (!team) {
						return;
					}

					var tbody = Object.keys(team).map(function (i, index) {
						var player = team[i];
						var kill   = Number(player.kill);
						var die    = Number(player.die);
						var score  = Number(player.score);

						return `<tr>
							<td>${index + 1}</td>
							<td>${nicknames[player.pid]}</td>
							<td>${kill}</td>
							<td>${die}</td>
							<td>${kdRatio(kill, die)}</td>
							<td>${score}</td>
						</tr>`;
					}).join('');

					return `<div>
							<h4>${i18n.team} ${+teamNum + 1}</h4>
							<table>
								<thead>
									<tr>
										<th>#</th>
										<th>${i18n.nickname}</th>
										<th>${i18n.kills}</th>
										<th>${i18n.died}</th>
										<th>${i18n.kdRatio}</th>
										<th>${i18n.score}</th>
									</tr>
								</thead>
								<tbody>${tbody}</tbody>
							</table>
						</div>`;
				});

				return `<table>
					<tr>
						<td>${result.join('</td><td>')}</td>
					</tr>
				</table>`;
			};

			var getIds = function (teams) {
				return ['0', '1'].reduce(function (ids, teamNum) {
					var team = teams[teamNum];

					if (!team) {
						return ids;
					}

					return ids.concat(Object.keys(team).map(function (i) {
						return team[i].pid;
					}));
				}, []);
			};

			return function () {
				var domElem = $('<div>', {
					html: '<h1>' + i18n.title + '</h1>' +
					'<div class="loading">Loading...</div>'
				});

				var loader = domElem.find('.loading');

				var body = $('<div>');
				body.appendTo(domElem);

				domElem.data('load', function (data) {
					var ids = getIds(data.stats.accounts);
					params.api
						.getNickNames(ids)
						.then(function (nicknames) {
							loader.detach();
							body.html(tpl(data, nicknames));
							domElem.trigger('loaded');
						});
				}.bind(domElem));

				return domElem;
			};
		})({ language: config.language, api: api });

		var Match = (function (params) {
			var i18n = {
				russian: {
					id: 'ID',
					replay: 'Скачать реплей',
					time_start: 'Время начала матча',
					duration: 'Продолжительность',
					durationMetric: 'сек.'
				},
				english: {
					id: 'ID',
					replay: 'Download replay',
					time_start: 'Time of match start',
					duration: 'Match duration',
					durationMetric: 'sec.'
				}
			}[params.language];

			var tpl = function (data) {
				var stats = data.stats;
				return `<h3>${i18n.id} ${data.id}</h3>
					<h4>${stats.name} (${stats.weather}) &mdash; ${stats.mode}</h4>
					<small>
						${i18n.time_start} ${stats.time_start},
						${i18n.duration} ${stats.game_duration}${i18n.durationMetric}
					</small>
					<div>
						<a href="http://${decodeURIComponent(stats.replay_path)}" target="_blank">${i18n.replay}</a>
					</div>`;
			};

			return function () {
				var domElem = $('<div>', {
					html: '<div class="loading">Loading...</div>'
				});

				var loader = domElem.find('.loading');

				var info = $('<div>');
				info.appendTo(domElem);

				var details = new MatchResults;
				details.appendTo(domElem);

				domElem.data('load', function (data) {
					loader.detach();
					info.html(tpl(data));
					details.data('load')(data);
					domElem.trigger('loaded');
				}.bind(domElem));

				return domElem;
			};
		})({ language: config.language });

		var MatchSearch = (function (params) {
			var i18n = {
				russian: {
					title: 'Поиск матча',
					matchId: 'ID матча',
					find: 'Найти'
				},
				english: {
					title: 'Match search',
					matchId: 'Match ID',
					find: 'Find'
				}
			}[params.language];

			return function (options) {
				var storageKey = 'match:search';

				var domElem = $('<form>', {
					html: `<h1>${i18n.title}</h1>
						<div class="loading">Loading...</div>
						<label>
							${i18n.matchId}:
							<input name="matchId" type="number" value="${params.storage.get(storageKey)}" />
						</label>
						<input type="submit" value="${i18n.find}" />`
				});

				var loader = domElem.find('.loading');
				loader.detach();

				var match;
				if (options.match) {
					match = options.match;
				} else {
					match = new Match;
					match.appendTo(domElem);
				}

				domElem.on('submit', function (e) {
					e.preventDefault();

					var matchId = Number(this.matchId.value);

					if (isNaN(matchId)) {
						return console.error('wrong type of matchId');
					}

					params.storage.set(storageKey, matchId);

					loader.appendTo(domElem);

					params.api
						.matchInfo(matchId)
						.then(function (data) {
							match.data('load')(data);
							loader.detach();
						});
				});

				return domElem;
			};
		})({ language: config.language, api: api, storage: config.storage });

		var LatestMatch = (function (params) {
			var i18n = {
				russian: {
					title: 'Последний матч'
				},
				english: {
					title: 'Latest match'
				}
			}[params.language];

			return function (options) {
				var domElem = $('<div>', {
					html: '<h1 class="latestMatch__title">' + i18n.title + '</h1>' +
					'<div class="loading">Loading...</div>'
				});

				var title  = domElem.find('.latestMatch__title');
				var loader = domElem.find('.loading');

				var match;
				if (options.match) {
					match = options.match;
				} else {
					match = new Match;
					match.appendTo(domElem);
				}

				var updateTitle = function (id) {
					title.html(`${i18n.title}: ${id}`);
					return id;
				};

				domElem.data('load', function (data) {
					loader.detach();
					updateTitle(data.id);
					match.data('load')(data);
					domElem.trigger('loaded');
				}.bind(domElem));

				params.api
					.maxMatch()
					.then(updateTitle)
					.then(api.matchInfo)
					.then(function (data) {
						domElem.data('load')(data);
					});

				return domElem;
			};
		})({ language: config.language, api: api });

		var LangSwitcher = (function (params) {
			var i18n = {
				russian: {
					russian: 'Русский',
					english: 'English'
				},
				english: {
					russian: 'Русский',
					english: 'English'
				}
			}[params.language];

			return function () {
				var domElem = $('<div>', {
					className: 'lang-switcher',
					html: params.languages.map(function (lang) {
						return `<a href="#!/${lang}" data-lang="${lang}" class="lang-switcher__elem">${i18n[lang]}</a>`;
					}).join('&nbsp;|&nbsp;')
				});

				domElem.on('click', '.lang-switcher__elem', function (e) {
					e.preventDefault();
					var $this = $(this);
					var lang  = $this.data('lang');
					if (lang !== params.language) {
						params.storage.set(params.langStorageKey, lang);
						window.location.reload();
					}
				});

				return domElem;
			};
		})({ language: config.language, languages: config.languages, storage: config.storage, langStorageKey: config.langStorageKey });

		var langSwitcher = new LangSwitcher;
		langSwitcher.prependTo(main);

		var match = new Match;

		var matchSearch = new MatchSearch({ match: match });

		var latestMatch = new LatestMatch({ match: match });
		latestMatch.appendTo(main);

		matchSearch.appendTo(main);

		match.appendTo(main);

		main.find('> .loading').remove();
	});
})({
	api: '/v1/cmd',
	languages: ['russian', 'english'],
	langStorageKey: 'language',
	storage: {
		get: localStorage.getItem.bind(localStorage),
		set: localStorage.setItem.bind(localStorage)
	}
});
