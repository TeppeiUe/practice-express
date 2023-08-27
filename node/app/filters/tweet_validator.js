const express = require('express');
const { check } = require('../services');


/**
 * API: /tweet (POST), ツイート
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.create = (req, callback) => {

  const { message } = req.body;
  let err_msg = [];

  try {
    if (message === undefined) {
        err_msg.push('message is undefined');
    } else
    if (check.is_empty(message)) {
      err_msg.push('message is empty');
    } else
    if (!check.is_string(message)) {
      err_msg.push('message is not string');
    } else
    if (!check.is_string_within_range(message, 1, 140)) {
      err_msg.push('message is out of range');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      callback.success({
        user_id: req.current_user.id,
        ...{ message }
      });
    }

  } catch (err) {
    callback.error(err);

  }

};


/**
 * API: /tweet/:id, ツイート詳細
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.show = (req, callback) => {

  const tweet_id = req.params.id;
  let err_msg = [];

  try {
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
      callback.success({ id: tweet_id });
    }

  } catch (err) {
    callback.error(err);

  }

};


/**
 * API: /tweet/:id (DELETE), ツイート削除
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.delete = (req, callback) => {

  const tweet_id = req.params.id;
  let err_msg = [];

  try {
    if (tweet_id === undefined) {
      err_msAg.push('tweet_id is undefined');
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
      callback.success({
        user_id: req.current_user.id,
        ...{ tweet_id }
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