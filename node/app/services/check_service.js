const { user, tweet } = require('../models');


/**
 * 未定義以外の空のチェック
 * @param {any} val
 * @returns {boolean}
 */
 module.exports.isEmpty = val => {
  if (val === null) return true
  if (Array.isArray(val)) return Boolean(val.length)
  return typeof val !== 'string' ? false : !Boolean(val.length);
};


/**
 * 正の整数のチェック
 * @param {any} val
 * @returns {boolean}
 */
module.exports.isPositiveInteger = val => {
  const num = Number(val);
  if (num === undefined) return false
  return Number.isInteger(num) ? 1 <= val : false
};


/**
 * 文字列チェック
 * @param {any} val
 * @returns {boolean}
 */
module.exports.isString = val => typeof val === 'string';


/**
 * 文字列の文字数チェック
 * @param {any} val
 * @param {number} mi
 * @param {number} max
 * @returns {boolean}
 */
module.exports.isStringWithinRange = (val, min, max) => {
  const len = this.isEmpty(val) && this.isString(val) ? 0 : val.length;
  return min <= len && len <= max
};


/**
 * メールアドレスチェック
 * @param {string} val
 * @returns {boolean}
 */
module.exports.isMailAddress = val => val === undefined ? false : val.match(/.+@.+\..+/);


/**
 * ユーザーの存在チェック
 * @param {number|string} id
 * @returns {boolean}
 */
module.exports.userExist = async id => !!(await user.findByPk(id));


/**
 * ユーザー名の存在チェック(unique検証)
 * @param {string} user_name
 * @returns {number|null} ユーザーIDかnullを返却
 */
module.exports.userNameExist = async user_name => {
  const res = await user.findOne({
    where: { user_name }
  });
  return res ? res.id : null
};


/**
 * メールアドレスの存在チェック(unique検証)
 * @param {string} email
 * @returns {number|null} ユーザーIDかnullを返却
 */
module.exports.emailExist = async email => {
  const res = await user.findOne({
    where: { email }
  });
  return res ? res.id : null
};


/**
 * ツイートの存在チェック
 * @param {string|number} id
 * @returns {boolean}
 */
module.exports.tweetExist = async id => !!(await tweet.findByPk(id));
