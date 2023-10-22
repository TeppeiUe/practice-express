const express = require('express');
const { check, crypto } = require('../services');
const { WEB } = require('config');
const ValidationError = require('../formats/ValidationError');

/**
 * API: /login (POST), ログイン
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
module.exports.create = (req, res, callback) => {
  let { email, password } = req.body;

  try {
    /** emailの検証 */
    check.isRequired(email, 'email');
    /** passwordの検証 */
    check.isRequired(password, 'password');

    // passwordのhash化
    if (WEB.PASSWORD.SECURE) {
      password = crypto.getHash(password);
    }

    callback.success({ email, password });

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
