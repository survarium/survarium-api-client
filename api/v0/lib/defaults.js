const ENV = process.env;

module.exports = {
	retries:    !isNaN(+ENV.SV_API_RETRIES) ? +ENV.SV_API_RETRIES : 10,
	stackMode:  !!ENV.SV_API_STACK_MODE,
	delayMode:  !!ENV.SV_API_DELAY_MODE,
	stackPause: !isNaN(+ENV.SV_API_STACK_PAUSE) ? +ENV.SV_API_STACK_PAUSE : 20,
	saveSource: ENV.SV_API_SAVE_SOURCE || false,
	delayMin:   !isNaN(+ENV.SV_API_DELAY_MIN) ? +ENV.SV_API_DELAY_MIN : 20,
	delayMax:   !isNaN(+ENV.SV_API_DELAY_MAX) ? +ENV.SV_API_DELAY_MAX : 200
};
