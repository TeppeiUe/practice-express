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
module.exports.cookie_check = async (req, res, next) => {
  const { path, method, cookies } = req;

  log.access.info(`request url=[${path}] method=[${method}]`);

  const { session_id } = cookies;

  if (session_id === undefined) {
    log.app.info('cookie is not found');
    next(new CommonResponse(401, ['cookie is not found']));

  } else {
    await session.search(session_id, (ret, err) => {

      if (err) {
        log.app.error(err.stack);
        next(new CommonResponse);

      } else {
        if (ret) {
          const { user_id, expires } = ret;
          session.setCookie(res, session_id, expires);

          // 後続のミドルウェアで使用予定
          req.current_user = { id: user_id };

          next();

        } else {
          next(new CommonResponse(401, ['session out']));

        }

      }

    })

  }

};