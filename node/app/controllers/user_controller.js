const express = require('express');
const models = require('../models');
const log = require('../logs');
const { user_validator } = require('../filters');
const { session } = require('../services');
const CommonResponse = require('../formats/CommonResponse');
const UserBaseMode = require('../formats/UserBaseModel');
const UserResponse = require('../formats/UserResponse');
const { DB } = require('config');
const { attributes } = DB.USER_TABLE;
const { order } = DB.COMMON_TABLE;

/**
 * API: /user, ユーザー登録
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.create = async (req, res, next) => {
  const callback = {
    success: async obj => {
      const user = await models.user.create(obj)
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
            res.location(`/user/${user.id}`);
            res.status(201).json({
              user: new UserBaseMode(user),
            });
          }
        })
      } else {
        next(new CommonResponse(400, ['signup failure']));
      }
    },
    failure: msg => next(new CommonResponse(400, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  user_validator.create(req, res, callback);
};


/**
 * API: /user/:id, ユーザー情報
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.show = async (req, res, next) => {
  const callback = {
    success: async ({ id }) => {
      const user = await models.user.findByPk(id, {
        include: {
          model: models.tweet,
          order,
          include: {
            model: models.user,
            as: 'passive_favorite',
            order,
          },
        },
        attributes,
      })
      .catch(err => {
        log.app.error(err.stack);
        next(new CommonResponse);
      });

      res.json({
        user: new UserResponse(user),
      });
    },
    failure: msg => next(new CommonResponse(400, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  user_validator.show(req, res, callback);
};


/**
 * API: /user (PUT), ユーザー情報更新
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.update = async (req, res, next) => {
  const callback = {
    success: async obj => {
      const { id } = res.locals.user;

      await models.user.update(
        obj, {
        where: { id },
      })
      .catch(err => {
        log.app.error(err.stack);
        next(new CommonResponse);
      });

      res.status(204).end();
    },
    failure: msg => next(new CommonResponse(400, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  user_validator.update(req, res, callback);
};


/**
 * API: /users, ユーザー一覧
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.index = async (req, res, next) => {
  const users = await models.user.findAll({
    attributes,
    order,
  })
  .catch(err => {
    log.app.error(err.stack);
    next(new CommonResponse);
  });

  res.json({
    users: users.map(user => new UserBaseMode(user)),
  });
};
