const express = require('express');
const models = require('../models');
const log = require('../logs');
const { relation_validator } = require('../filters');
const CommonResponse = require('../formats/CommonResponse');
const UserBaseModel = require('../formats/UserBaseModel');
const { DB } = require('config');
const { attributes } = DB.USER_TABLE;
const { order } = DB.COMMON_TABLE;

/**
 * API: /user/:id/following (POST), フォロー
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.create = async (req, res, next) => {
  const callback = {
    success: async obj => {
      const [_, created] = await models.relationship.findOrCreate({
        where: obj,
        defaults: obj,
      })
      .catch(err => {
        log.app.error(err);
        next(new CommonResponse);
      });

      if (created) {
        res.status(204).end();
      } else {
        next(new CommonResponse(400, ['already follow this user']));
      }
    },
    failure: msg => next(new CommonResponse(400, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  relation_validator.create(req, res, callback);
};


/**
 * API: /user/:id/followings, フォロー一覧
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.followings = async (req, res, next) => {
  const callback = {
    success: async ({ id, ...obj }) => {
      const users = await models.user.findAll({
        include: {
          model: models.user,
          as: 'follower',
          attributes: [],
          where: {
            id,
          }
        },
        subQuery: false,
        attributes,
        order,
        ...obj,
      })
      .catch(err => {
        log.app.error(err);
        next(new CommonResponse);
      });

      res.json({
        users: users.map(user => new UserBaseModel(user)),
      });
    },
    failure: msg => next(new CommonResponse(400, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  relation_validator.index(req, res, callback);
}


/**
 * API: /user/:id/followers, フォロワー一覧
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.followers = async (req, res, next) => {
  const callback = {
    success: async ({ id, ...obj }) => {
      const user = await models.user.findAll({
        include: {
          model: models.user,
          as: 'following',
          attributes: [],
          where: {
            id,
          },
        },
        subQuery: false,
        attributes,
        order,
        ...obj,
      })
      .catch(err => {
        log.app.error(err);
        next(new CommonResponse);
      });

      res.json({
        users: user.map(user => new UserBaseModel(user)),
      });
    },
    failure: msg => next(new CommonResponse(400, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  relation_validator.index(req, res, callback);
}


/**
 * API: /user/:id/following (DELETE), フォロー削除
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.delete = async (req, res, next) => {
  const callback = {
    success: async obj => {
      const following = await models.relationship.destroy({
        where: obj,
      })
      .catch(err => {
        log.app.error(err.stack);
        next(new CommonResponse);
      });

      if (following) {
        res.status(204).end();
      } else {
        next(new CommonResponse(400, ['cannot delete']));
      }
    },
    failure: msg => next(new CommonResponse(400, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  relation_validator.delete(req, res, callback);
};
