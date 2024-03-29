const express = require('express');
const crypto = require('crypto');
const moment = require('moment');
const models = require('../models');
const UserBaseModel = require('../formats/UserBaseModel');
const { WEB, DB } = require('config');
const { TLS, HOST } = WEB;
const { NAME, EXPIRES, SAME_SITE } = WEB.COOKIE;
const { attributes } = DB.USER_TABLE;


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
  const expires = moment().add(EXPIRES.VALUE, EXPIRES.UNIT).toISOString();

  await models.session.create({
      session_id,
      user_id,
      expires
  })
  .then(() => callback({ session_id, expires }, null))
  .catch(err => callback(null, err));

  return callback

};


/**
 * 指定したsession_idよりユーザーを検索
 * @param {number | string} session_id
 * @param {callback} callback
 */
 module.exports.search = async (session_id, callback) => {
  const session = await models.session.findByPk(session_id, {
      include: {
        model: models.user,
        attributes,
      },
    })
    .catch(err => callback(null, err));

  if (session) {
    const expires = moment().add(EXPIRES.VALUE, EXPIRES.UNIT);
    await session.update({ expires })
    .then(() => {
      const user = new UserBaseModel(session.user);
      callback({
        user,
        expires,
      }, null);
    })
    .catch(err => callback(null, err));

  } else {
    callback(null, null);
  }

  return callback
};


/**
 * 指定したsession_idを削除
 * @param {number|string} session_id
 * @param {callback} callback
 */
 module.exports.delete = async (session_id, callback) => {

  await models.session.destroy({
    where: { session_id }
  })
  .then(() => callback(null, null))
  .catch(err => callback(null, err));

  return callback

};

// sameSite属性のdefaultは「lax」であるが、secure属性がある場合「none」で無ければblockされる。
const cookieOptions = {
  domain: HOST,
  httpOnly: true,
  secure: TLS,
  sameSite: TLS ? SAME_SITE : 'lax'
}

/**
 * Set Cookie to response
 * @param {express.Response} res
 * @param {string} session_id
 * @param {Date} expires
 */
module.exports.setCookie = (res, session_id, expires) => {
  res.cookie(NAME, session_id, {
    expires: new Date(expires),
    ...cookieOptions
  });
};


/**
 * Clear Cookie to response
 * @param {express.Response} res
 */
module.exports.crearCookie = res => res.clearCookie(NAME, cookieOptions);
