const express = require('express');
const { check, crypto } = require('../services');
const { WEB } = require('config');
const { user } = require('../models');
const ValidationError = require('../formats/ValidationError');


/**
 * API: /user (POST), ユーザー登録
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.create = async (req, res, callback) => {
  let { user_name, email, password } = req.body;

  try {
    /** user_nameの検証 */
    await check.userName(user_name);

    /** emailの検証 */
    check.isRequired(email, 'email');
    // emailのpattern検証
    if (!email.match(/.+@.+\..+/)) {
      throw new ValidationError('Invalid email');
    }
    // emailのunique検証
    await user.findOne({
      where: { email },
    })
    .then(u => {
      if (u) {
        throw new ValidationError('email is already exist');
      }
    })

    /** passwordの検証 */
    check.isRequired(password, 'password');

    // passwordのhash化
    if (WEB.PASSWORD.SECURE) {
      password = crypto.getHash(password);
    }
    callback.success({ user_name, email, password });

  } catch (err) {
    if (err instanceof ValidationError) {
      callback.failure(err.message);
    } else {
      callback.error(err);
    }
  }
};


/**
 * API: /user/:id, ユーザー情報
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
 * API: /user (PUT), ユーザー情報更新
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
module.exports.update = async (req, res, callback) => {
  const { user_name, profile, image } = req.body;
  const user_id = res.locals.user.id;

  try {
    /** user_nameの検証 */
    await check.userName(user_name, user_id);

    /** profileの検証 */
    check.isRequired(profile, 'profile');
    check.wordCount(profile, 'profile', 1, 140);

    /** imageの検証 */
    check.isRequired(image, 'image');

    callback.success({ user_name, profile, image });

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
