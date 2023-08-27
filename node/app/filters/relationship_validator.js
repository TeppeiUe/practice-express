const express = require('express');
const { check } = require('../services');


/**
 * API: /user/:id/following (POST), フォロー
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.create = async (req, callback) => {

  const follow_id = req.params.id; // フォローする相手
  const user_id = req.current_user.id; // 自分
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
    if (Number(follow_id) === user_id) {
      err_msg.push('prohibit same user follow');
    } else
    if (!(await check.user_exist(follow_id))) {
      err_msg.push('user is not found');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({ follow_id, user_id });
    }

  } catch (err) {
    callback.error(err);

  }

};


/**
 * API: /user/:id/(followings, followers), (フォロー, フォロワー)一覧
 * @param {express.Request} req
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
 * API: /user/:id/following (DELETE), フォロー削除
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.delete = async (req, callback) => {

  const follow_id = req.params.id; // フォロー削除する相手
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

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({
        ...{ follow_id },
        user_id: req.current_user.id
      });
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