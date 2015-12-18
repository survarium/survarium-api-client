'use strict';

(function (config) {
	$(document).ready(function () {
		$.ajaxSetup({
			dataType: 'json',
			timeout: 5 * 1000,
			error: console.error.bind(console)
		});

		var main = $('#main');

		var api = {
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
			}
		};

		var matchDescriptionTpl = (function (params) {
			var i18n = {
				russian: {
					id: 'ID',
					replay: 'Скачать реплей',
					time_start: 'Время начала матча',
					duration: 'Продолжительность',
					durationMetric: 'сек.'
				}
			}[params.language];

			return function (data) {
				var stats = data.stats;
				var html = `<h3>${i18n.id} ${data.id}</h3>
					<h4>${stats.name} (${stats.weather}) &mdash; ${stats.mode}</h4>
					<small>
						${i18n.time_start} ${stats.time_start},
						${i18n.duration} ${stats.game_duration}${i18n.durationMetric}
					</small>
					<div>
						<a href="http://${decodeURIComponent(stats.replay_path)}" target="_blank">${i18n.replay}</a>
					</div>`;
				return $(html);
			};
		})({ language: config.language });

		var LatestMatch = (function (params) {
			var i18n = {
				russian: {
					title: 'Последний матч'
				}
			}[params.language];

			return function () {
				var domElem = $('<div>', {
					html: '<h1>' + i18n.title + '</h1>' +
					'<div class="loading">Loading...</div>'
				});

				domElem.data('load', function (data) {
					this.find('.loading').remove();
					this.append(matchDescriptionTpl(data));
					domElem.trigger('loaded');
				}.bind(domElem));

				params.api
					.maxMatch()
					.then(api.matchInfo)
					.then(function (match) {
						domElem.data('load')(match);
					});

				return domElem;
			};
		})({ language: config.language, api: api });

		var latestMatch = new LatestMatch;
		latestMatch.appendTo(main);

		latestMatch.on('loaded', function () {
			main.find('> .loading').remove();
		});
	});
})({
	api: '/v1/cmd',
	language: 'russian'
});
