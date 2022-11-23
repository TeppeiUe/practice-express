const crypto = require('crypto');
const moment = require('moment');
const { WEB } = require('config');
const models = require('../models');


/**
 * callback関数の定義
 * @callback callback
 * @param {object} success
 * @param {any} error
 */

/**
 * 指定したuserのセッション情報を新規登録
 * @param {number|string} user_id
 * @param {callback} callback
 */
module.exports.create = async (user_id, callback) => {

  const session_id = crypto.randomBytes(8).toString('base64');
  const setting = WEB.COOKIE.EXPIRES;
  const expires = moment().add(setting.VALUE, setting.UNIT).toISOString();

  await models.session.create({
      session_id,
      user_id,
      expires
  }).catch(err => callback(null, err));

  return callback({ session_id, expires }, null)

};


/**
 * 指定したsession_idよりユーザーを検索
 * @param {number|string} session_id
 * @param {callback} callback
 */
 module.exports.search = async (session_id, callback) => {

  const session = await models.session.findByPk(session_id)
  .catch(err => callback(null, err));

  if (session) {
    const setting = WEB.COOKIE.EXPIRES;
    const expires = moment().add(setting.VALUE, setting.UNIT);

    await session.update({ expires })
    .catch(err => callback(null, err));

    return callback({
      user_id: session.user_id,
      ...{ expires }
    }, null)

  } else {
    return callback(null, null)

  }

};


/**
 * 指定したsession_idを削除
 * @param {number|string} session_id
 * @param {any} callback
 */
 module.exports.delete = async (session_id, callback) => {

  await models.session.destroy({
    where: { session_id }
  })
  .catch(err => callback(err));

  return callback(null)

};