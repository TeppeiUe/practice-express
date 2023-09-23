const express = require('express');
const { check, crypto } = require('../services');
const { WEB } = require('config');


/**
 * API: /user (POST), ユーザー登録
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
 module.exports.create = async (req, res, callback) => {

  let { user_name, email, password } = req.body;
  let err_msg = [];

  try {
    if (user_name === undefined) {
        err_msg.push('user_name is undefined');
    } else
    if (check.isEmpty(user_name)) {
      err_msg.push('user_name is empty')
    } else
    if (!check.isString(user_name)) {
      err_msg.push('user_name is not string');
    } else
    if (!check.isStringWithinRange(user_name, 1, 16)) {
      err_msg.push('message is out of range');
    } else
    if (await check.userNameExist(user_name)) {
      err_msg.push('user_name is already exist');
    }

    if (email === undefined) {
      err_msg.push('email is undefined');
    } else
    if (check.isEmpty(email)) {
      err_msg.push('email is empty');
    } else
    if (!check.isMailAddress(email)) {
      err_msg.push('email is not email format');
    } else
    if (await check.emailExist(email)) {
      err_msg.push('email is already exist');
    }

    if (password === undefined) {
      err_msg.push('password is undefined');
    } else
    if (check.isEmpty(password)) {
      err_msg.push('password is empty');
    } else
    if (!check.isString(password)) {
      err_msg.push('password is not string');
    }

    if (err_msg.length) {
      callback.failure(err_msg);
    } else {
      if (WEB.PASSWORD.SECURE) {
        password = crypto.getHash(password);
      }
      callback.success({ user_name, email, password });
    }

  } catch (err) {
    callback.error(err)

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
  let err_msg = [];

  try {
    // pathに:idが存在しない場合404返却のため、存在性チェックは不要
    if (!check.isPositiveInteger(id)) {
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
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
module.exports.update = async (req, res, callback) => {

  const { user_name, profile, image } = req.body;
  const { user_id } = res.locals;
  let err_msg = [];

  try {
    if (user_name === undefined) {
      err_msg.push('usr_name is undefined');
    } else
    if (check.isEmpty(user_name)) {
      err_msg.push('user_name is empty')
    } else
    if (!check.isString(user_name)) {
      err_msg.push('user_name is not string')
    } else
    if (!check.isStringWithinRange(user_name, 1, 16)) {
      err_msg.push('user_name is out of range');
    } else
    if ((await check.userNameExist(user_name) || user_id) !== user_id) {
      err_msg.push('user_name is already exist');
    }

    if (profile === undefined) {
      err_msg.push('email is undefined');
    } else
    if (!check.isString(profile)) {
      err_msg.push('profile is not string');
    } else
    if (!check.isStringWithinRange(profile, 1, 140)) {
      err_msg.push('profile is out of range');
    }

    if (image === undefined) {
      err_msg.push('image is undefined');
    } else
    if (!check.isString(image)) {
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