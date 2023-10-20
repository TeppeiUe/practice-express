const express = require('express');
const { session, check } = require('../services');
const log = require('../logs');
const CommonResponse = require('../formats/CommonResponse');
const ValidationError = require('../formats/ValidationError');
const { DB } = require('config');
const { LIMIT, OFFSET } = DB.COMMON_TABLE;

/**
 * cookieチェック
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.cookieCheck = async (req, res, next) => {
  const { path, method, cookies } = req;
  const { session_id } = cookies;

  log.access.info(`request url=[${path}] method=[${method}]`);

  if (session_id === undefined) {
    next(new CommonResponse(401, ['cookie is required']));

  } else {
    await session.search(session_id, (ret, err) => {
      if (err) {
        log.app.error(err.stack);
        next(new CommonResponse);
      } else {
        if (ret) {
          const { user, expires } = ret;
          session.setCookie(res, session_id, expires);
          // 後続のミドルウェアで使用
          res.locals = { user };
          next();
        } else {
          next(new CommonResponse(401, ['Invalid cookie']));
        }
      }
    });
  }
};


/**
 * 一覧取得共通validatior
 * @param {express.Response} res
 * @param {express.Request} req
 * @param {callback} callback
 */
module.exports.index = (req, res, callback) => {
  let { limit, offset } = req.query;

  try {
    /** limitの検証 */
    check.queryOption(limit, 'limit');
    if (limit === undefined) {
      limit = LIMIT;
    }

    /** offsetの検証 */
    check.queryOption(offset, 'offset');
    if (offset === undefined) {
      offset = OFFSET;
    }

    callback.success({
      limit,
      offset,
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
