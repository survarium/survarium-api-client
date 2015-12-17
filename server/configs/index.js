module.exports = {
	env: process.env.NODE_ENV  || 'development',
	handle: process.env.LISTEN || 3005,

	keys: {
		public: 'test',
		private: 'test'
	},

	api: 'http://api.survarium.com/',

	workers: process.env.NODE_WORKERS || require('os').cpus().length
};
