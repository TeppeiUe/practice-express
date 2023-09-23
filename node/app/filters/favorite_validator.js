const express = require('express');
const { check } = require('../services');
const { tweet } = require('../models');
const ValidationError = require('../formats/ValidationError');


/**
 * API: /tweet/:id/favorite (POST), お気に入り登録
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.create = async (req, res, callback) => {
  const tweet_id = req.params.id;
  const user_id = res.locals.user.id;

  try {
    /** path parameterの検証 */
    check.pathParameter(tweet_id);
    // 対象tweetの存在チェック
    await tweet.findByPk(tweet_id)
    .then(t => {
      if (!t) {
        throw new ValidationError('tweet is not found');
      }
    });

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
 * API: /user/:id/favorites , お気に入りツイート一覧
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.index = (req, res, callback) => {
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
 * API: /tweet/:id/favorite (DELETE), お気に入り削除
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.delete = (req, res, callback) => {
  const tweet_id = req.params.id;
  const user_id = res.locals.user.id;

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
