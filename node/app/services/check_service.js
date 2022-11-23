/**
 * 未定義以外の空のチェック
 * @param {any} val
 * @returns {boolean}
 */
 module.exports.is_empty = val => {
  if (val === null) return true
  if (Array.isArray(val)) return Boolean(val.length)
  return typeof val !== 'string' ? false : !Boolean(val.length);
};


/**
 * 正の整数のチェック
 * @param {any} val
 * @returns {boolean}
 */
module.exports.is_positive_integer = val => {
  const num = Number(val);
  if (num === undefined) return false
  return Number.isInteger(num) ? 1 <= val : false
};


/**
 * 文字列チェック
 * @param {any} val
 * @returns {boolean}
 */
module.exports.is_string = val => typeof val === 'string';


/**
 * 文字列の文字数チェック
 * @param {any} val
 * @param {number} mi
 * @param {number} max
 * @returns {boolean}
 */
module.exports.is_string_within_range = (val, min, max) => {
  const len = this.is_empty(val) && this.is_string(val) ? 0 : val.length;
  return min <= len && len <= max
};


/**
 * メールアドレスチェック
 * @param {string} val
 * @returns {boolean}
 */
module.exports.is_mail_address = val => val === undefined ? false : val.match(/.+@.+\..+/);