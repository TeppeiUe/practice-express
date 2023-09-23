const express = require('express');
const models = require('../models');
const { Op } = models.Sequelize;
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
    success: async ({ email, password }) => {
      const user = await models.user.findOne({
        where: {
          [Op.and]: [
            { email },
            { password }
          ]
        },
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
    failure: msg_list => next(new CommonResponse(401, msg_list)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  session_validator.create(req, callback);
};


/**
 * API: /session (POST), セッションチェック
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.search = async (req, res, next) => {
  const user = await models.user.findByPk(req.current_user.id)
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
  const callback = {
    success: async () => {
      await session.delete(req.cookies.session_id, (ret, err) => {
        if (err) {
          log.app.error(err);
          next(new CommonResponse);
        } else {
          session.crearCookie(res);
          res.status(204).end();
        }
      });
    },
    failure: msg_list => next(new CommonResponse(401, msg_list)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  session_validator.delete(req, callback);
};
