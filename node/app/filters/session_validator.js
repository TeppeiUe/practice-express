const { check } = require('../services');


/**
 * API: /login (POST), ログイン
 * @param {HttpRequest} req
 * @param {callback} callback
 */
module.exports.create = (req, callback) => {

  const { email, password } = req.body;
  let err_msg = [];

  try {
    if (email === undefined) {
      err_msg.push('email is undefined');
    } else
    if (check.is_empty(email)) {
      err_msg.push('email is empty');
    } else
    if (!check.is_mail_address(email)) {
      err_msg.push('email is not email format');
    }

    if (password === undefined) {
      err_msg.push('password is undefined');
    } else
    if (check.is_empty(password)) {
      err_msg.push('password is empty');
    } else
    if (!check.is_string(password)) {
      err_msg.pash('password is not string');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({ email, password });
    }

  } catch (err) {
    callback.error(err);

  }

};


/**
 * API: /logout (DELETE), ログアウト
 * @param {HttpRequest} req
 * @param {callback} callback
 */
module.exports.delete = (req, callback) => {

  const { session_id } = req.cookies;
  let err_msg = [];

  if (session_id === undefined) {
    err_msg.push('cookie is not found');
  }

  if (err_msg.length) {
    callback.failure(err_msg);
  } else {
    callback.success();
  }

};


/**
 * callback関数定義
 * @typedef {object} callback
 * @prop {SuccessFunction} success
 * @prop {FailureFunction} failure
 * @prop {ErrorFunction} error
 */

/**
 * callback関数メソッド
 * @typedef {function(object): ServerResponse} SuccessFunction
 * @typedef {function(string[]): ServerResponse} FailureFunction
 * @typedef {function(any): ServerResponse} ErrorFunction
 */