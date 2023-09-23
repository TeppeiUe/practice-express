const express = require('express');
const { check } = require('../services');
const { user } = require('../models');
const ValidationError = require('../formats/ValidationError');


/**
 * API: /user/:id/following (POST), フォロー
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.create = async (req, res, callback) => {
  const follow_id = req.params.id; // フォローする相手
  const { user_id } = res.locals; // 自分

  try {
    /** path parameterの検証 */
    check.pathParameter(follow_id);
    // 対象ユーザが自身以外であること
    if (Number(follow_id) === user_id) {
      throw new ValidationError('prohibit same user follow');
    }
    // 対象ユーザの存在チェック
    await user.findByPk(follow_id).then(u => {
      if (!u) {
        throw new ValidationError('user is not found');
      }
    })

    callback.success({ follow_id, user_id });

  } catch (err) {
    if (err instanceof ValidationError) {
      callback.failure(err.message);
    } else {
      callback.error(err);
    }
  }
};


/**
 * API: /user/:id/(followings, followers), (フォロー, フォロワー)一覧
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
 * API: /user/:id/following (DELETE), フォロー削除
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.delete = async (req, res, callback) => {
  const follow_id = req.params.id; // フォロー削除する相手
  const { user_id } = res.locals; // 自分

  try {
    /** path parameterの検証 */
    check.pathParameter(follow_id);

    callback.success({
      follow_id,
      user_id,
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
