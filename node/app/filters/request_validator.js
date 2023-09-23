const express = require('express');
const { session } = require('../services');
const log = require('../logs');
const CommonResponse = require('../formats/CommonResponse');

/**
 * cookieチェック
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {ServerResponse}
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
