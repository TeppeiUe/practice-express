const express = require('express');
const models = require('../models');
const log = require('../logs');
const { session }  = require('../services');
const { session_validator } = require('../filters');
const CommonResponse = require('../formats/CommonResponse');
const UserBaseMode = require('../formats/UserBaseModel');
const { DB } = require('config');
const { attributes } = DB.USER_TABLE;

/**
 * API: /login (POST), ログイン
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.create = async (req, res, next) => {
  const callback = {
    success: async obj => {
      const user = await models.user.findOne({
        where: obj,
        attributes,
      })
      .catch(err => {
        log.app.error(err.stack);
        next(new CommonResponse);
      });

      if (user) {
        await session.create(user.id, async (ret, err) => {
          if (err) {
            log.app.error(err);
            next(new CommonResponse);
          } else {
            const { session_id, expires } = ret;
            session.setCookie(res, session_id, expires);
            res.json({
              user: new UserBaseMode(user),
            });
          }
        })
      } else {
        next(new CommonResponse(401, ['user is not found']));
      }
    },
    failure: msg => next(new CommonResponse(401, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  session_validator.create(req, res, callback);
};


/**
 * API: /session (POST), セッションチェック
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.search = async (req, res, next) => {
  const user = await models.user.findByPk(res.locals.user_id)
  .catch(err => {
    log.app.error(err.stack);
    next(new CommonResponse);
  });

  if (user) {
    res.json({
      user: new UserBaseMode(user),
    });
  } else {
    next(new CommonResponse(401, ['user is not found']));
  }
};


/**
 * API: /logout (DELETE), ログアウト
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.delete = async (req, res, next) => {
  await session.delete(req.cookies.session_id, (_, err) => {
    if (err) {
      log.app.error(err.stack);
      next(new CommonResponse);
    } else {
      session.crearCookie(res);
      res.status(204).end();
    }
  });
};
