const crypto = require('crypto');

const config = require('../configs');
const utils	 = require('./utils');

function getSignatureString(params) {
	var signature = params.url + params.method + utils.salt + utils.ts;
	return signature;
    //return $this->requestUrl . $this->httpMethod . $this->nonce . $this->timestamp;
}
/**
 * Create signature
 *
 * @return string
 */

function buildSignature () {
	var signature = crypto.createHmac('sha1', config.keys.private);
	signature.update(getSignatureString.call(null, arguments));
	return signature.digest('base64');
}

module.exports = {
	build: buildSignature,
	getString: getSignatureString
};
