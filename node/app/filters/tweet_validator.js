const express = require('express');
const { check } = require('../services');
const ValidationError = require('../formats/ValidationError');


/**
 * API: /tweet (POST), ツイート
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.create = (req, res, callback) => {
  const { message } = req.body;
  const { user_id } = res.locals;

  try {
    /** messageの検証 */
    check.isRequired(message, 'message');
    check.wordCount(message, 'message', 1, 140);

    callback.success({
      user_id,
      message,
    });

  } catch (err) {
    if (err instanceof ValidationError) {
      callback.failure(err.message);
    } else {
      callback.error(err);
    }
  }
};


/**
 * API: /tweet/:id, ツイート詳細
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.show = (req, res, callback) => {
  const { id } = req.params;

  try {
    /** path parameterの検証 */
    check.pathParameter(id);

    callback.success({ id });

  } catch (err) {
    if (err instanceof ValidationError) {
      callback.failure(err.message);
    } else {
      callback.error(err);
    }
  }
};


/**
 * API: /tweet/:id (DELETE), ツイート削除
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.delete = (req, res, callback) => {
  const tweet_id = req.params.id;
  const { user_id } = res.locals;

  try {
    /** path parameterの検証 */
    check.pathParameter(tweet_id);

    callback.success({
      user_id,
      tweet_id,
    });

  } catch (err) {
    if (err instanceof ValidationError) {
      callback.failure(err.message);
    } else {
      callback.error(err);
    }
  }
};


/**
 * validationコールバック
 * @callback callback
 * @param {function(any): Promise<void>} success
 * @param {function(string): void} failure
 * @param {function(any): void} error
 */
