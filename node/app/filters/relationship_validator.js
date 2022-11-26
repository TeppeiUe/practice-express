const { check } = require('../services');


/**
 * API: /user/:id/follow (POST), フォロー
 * @param {HttpRequest} req
 * @param {callback} callback
 */
 module.exports.create = async (req, callback) => {

  const follow_id = req.params.id; // フォローする相手
  const follower_id = req.current_user.id; // 自分
  let err_msg = [];

  try {
    if (follow_id === undefined) {
      err_msg.push('follow_id is undefined');
    } else
    if (check.is_empty(follow_id)) {
      err_msg.push('follow_id is empty');
    } else
    if (!check.is_positive_integer(follow_id)) {
      err_msg.push('follow_id is not positive integer');
    } else
    if (!(await check.user_exist(follow_id))) {
      err_msg.push('user is not found');
    }

    if (follower_id === undefined) {
      err_msg.push('follower_id is undefined');
    } else
    if (check.is_empty(follower_id)) {
      err_msg.push('follower_id is empty');
    } else
    if (!check.is_positive_integer(follower_id)) {
      err_msg.push('follower_id is not positive integer');
    }

    if (Number(follow_id) === Number(follower_id)) {
      err_msg.push('prohibit same user follow');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({ follow_id, follower_id });
    }

  } catch (err) {
    callback.error(err);

  }

};


/**
 * API: /user/:id/(follow, follower), (フォロー, フォロワー)一覧
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
 * API: /user/:id/follow (DELETE), フォロー削除
 * @param {HttpRequest} req
 * @param {callback} callback
 */
 module.exports.delete = async (req, callback) => {

  const follow_id = req.params.id; // フォロー削除する相手
  const follower_id = req.current_user.id; // 自分
  let err_msg = [];

  try {
    if (follow_id === undefined) {
      err_msg.push('follow_id is undefined');
    } else
    if (check.is_empty(follow_id)) {
      err_msg.push('follow_id is empty');
    } else
    if (!check.is_positive_integer(follow_id)) {
      err_msg.push('follow_id is not positive integer');
    }

    if (follower_id === undefined) {
      err_msg.push('follower_id is undefined');
    } else
    if (check.is_empty(follower_id)) {
      err_msg.push('follower_id is empty');
    } else
    if (!check.is_positive_integer(follower_id)) {
      err_msg.push('follower_id is not positive integer');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({ follow_id, follower_id });
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