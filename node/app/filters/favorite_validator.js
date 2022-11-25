const { check } = require('../services');


/**
 * API: /tweet/:id/favorite (POST), お気に入り登録
 * @param {HttpRequest} req
 * @param {callback} callback
 */
 module.exports.create = async (req, callback) => {

  const tweet_id = req.params.id;
  const user_id = req.current_user.id;
  let err_msg = [];

  try {
    if (user_id === undefined) {
      err_msg.push('user_id is undefined');
    } else
    if (check.is_empty(user_id)) {
      err_msg.push('user_id is empty');
    } else
    if (!check.is_positive_integer(user_id)) {
      err_msg.push('user_id is not positive integer');
    }

    if (tweet_id === undefined) {
      err_msg.push('tweet_id is undefined');
    } else
    if (check.is_empty(tweet_id)) {
      err_msg.push('tweet_id is empty');
    } else
    if (!check.is_positive_integer(tweet_id)) {
      err_msg.push('tweet_id is not positive integer');
    } else
    if (!(await check.tweet_exist(tweet_id))) {
      err_msg.push('tweet is not found');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({ user_id, tweet_id });
    }

  } catch (err) {
    callback.error(err);

  }

};


/**
 * API: /user/:id/favorite , お気に入りツイート一覧
 * @param {HttpRequest} req
 * @param {callback} callback
 */
 module.exports.index = (req, callback) => {

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
      callback.success({ id });
    }

  } catch (err) {
    callback.error(err);

  }

};


/**
 * API: /tweet/:id/favorite (DELETE), お気に入り削除
 * @param {HttpRequest} req
 * @param {callback} callback
 */
 module.exports.delete = (req, callback) => {

  const tweet_id = req.params.id;
  const user_id = req.current_user.id;
  let err_msg = [];

  try {
    if (user_id === undefined) {
      err_msg.push('user_id is undefined');
    } else
    if (check.is_empty(user_id)) {
      err_msg.push('user_id is empty');
    } else
    if (!check.is_positive_integer(user_id)) {
      err_msg.push('user_id is not positive integer');
    }

    if (tweet_id === undefined) {
      err_msg.push('tweet_id is undefined');
    } else
    if (check.is_empty(tweet_id)) {
      err_msg.push('tweet_id is empty');
    } else
    if (!check.is_positive_integer(tweet_id)) {
      err_msg.push('tweet_id is not positive integer');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({ user_id, tweet_id });
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