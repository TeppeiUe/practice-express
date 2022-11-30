const crypto = require('crypto');
const { WEB } = require('config');


/**
 * 指定した文字列を暗号化
 * @param {string} val
 * @returns {string}
 */
module.exports.getHash = val => {

  const sha512 = crypto.createHash('sha512');
  sha512.update(WEB.PASSWORD.SALT);
  sha512.update(val);

  return sha512.digest('base64')

};