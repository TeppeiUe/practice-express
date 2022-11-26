const { check } = require('../services');


/**
 * API: /user (POST), ユーザー登録
 * @param {HttpRequest} req
 * @param {callback} callback
 */
 module.exports.create = async (req, callback) => {

  const { user_name, email, password } = req.body;
  let err_msg = [];

  try {
    if (user_name === undefined) {
        err_msg.push('usr_name is undefined');
    } else
    if (check.is_empty(user_name)) {
      err_msg.push('user_name is empty')
    } else
    if (!check.is_string(user_name)) {
      err_msg.push('user_name is not string');
    } else
    if (await check.user_name_exist(user_name)) {
      err_msg.push('user_name is already exist');
    }

    if (email === undefined) {
      err_msg.push('email is undefined');
    } else
    if (check.is_empty(email)) {
      err_msg.push('email is empty');
    } else
    if (!check.is_mail_address(email)) {
      err_msg.push('email is not email format');
    } else
    if (await check.email_exist(email)) {
      err_msg.push('email is already exist');
    }

    if (password === undefined) {
      err_msg.push('password is undefined');
    } else
    if (check.is_empty(password)) {
      err_msg.push('password is empty');
    } else
    if (!check.is_string(password)) {
      err_msg.push('password is not string');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({ user_name, email, password });
    }

  } catch (err) {
    callback.error(err)

  }

};


/**
 * API: /user/:id, ユーザー情報
 * @param {HttpRequest} req
 * @param {callback} callback
 */
module.exports.show = (req, callback) => {

  const { id } = req.params;
  let err_msg = [];

  try {
    if (id === undefined) {
      err_msg.push('user_id is undefined');

    } else
    if (check.is_empty(id)) {
      err_msg.push('user_id is empty');
    } else
    if (!check.is_positive_integer(id)) {
      err_msg.push('user_id is not positive integer');
    }

    if (err_msg.length) {
        callback.failure(err_msg);
      } else {
        callback.success();
      }

  } catch (err) {
    callback.error(err);

  }

};


/**
 * API: /user (PUT), ユーザー情報更新
 * @param {HttpRequest} req
 * @param {callback} callback
 */
module.exports.update = async (req, callback) => {

  const { user_name, profile, image } = req.body;
  const { id } = req.current_user;
  let err_msg = [];

  try {
    if (user_name === undefined) {
      err_msg.push('usr_name is undefined');
    } else
    if (check.is_empty(user_name)) {
      err_msg.push('user_name is empty')
    } else
    if (!check.is_string(user_name)) {
      err_msg.push('user_name is not string')
    } else
    if ((await check.user_name_exist(user_name) || id) !== id) {
      err_msg.push('user_name is already exist');
    }

    if (profile === undefined) {
      err_msg.push('email is undefined');
    } else
    if (!check.is_string(profile)) {
      err_msg.push('profile is not string');
    }

    if (image === undefined) {
      err_msg.push('image is undefined');
    } else
    if (!check.is_string(image)) {
      err_msg.push('image is not string');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({ user_name, profile, image });
    }

  } catch (err) {
    callback.error(err);

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