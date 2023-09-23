const express = require('express');
const models = require('../models');
const { Op } = models.Sequelize;
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
    success: async ({ follow_id, user_id }) => {
      const [_, created] = await models.relationship.findOrCreate({
        where: {
          [Op.and] : [
            { follow_id },
            { user_id }
          ]
        },
        defaults: {
          follow_id,
          user_id
        }
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
    failure: msg_list => next(new CommonResponse(400, msg_list)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  relation_validator.create(req, callback);
};


/**
 * API: /user/:id/followings, フォロー一覧
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.followings = async (req, res, next) => {
  const callback = {
    success: async ({ id }) => {
      const users = await models.user.findByPk(id, {
        include: {
          model: models.user,
          as: 'following',
          attributes,
          order,
        },
      })
      .catch(err => {
        log.app.error(err);
        next(new CommonResponse);
      });

      res.json({
        users: users.following.map(user => new UserBaseModel(user)),
      });
    },
    failure: msg_list => next(new CommonResponse(400, msg_list)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  relation_validator.index(req, callback);
}


/**
 * API: /user/:id/followers, フォロワー一覧
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.followers = async (req, res, next) => {
  const callback = {
    success: async ({ id }) => {
      const user = await models.user.findByPk(id, {
        include: {
          model: models.user,
          as: 'follower',
          attributes,
          order,
        },
      })
      .catch(err => {
        log.app.error(err);
        next(new CommonResponse);
      });

      res.json({
        users: user.follower.map(user => new UserBaseModel(user)),
      });
    },
    failure: msg_list => next(new CommonResponse(400, msg_list)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  relation_validator.index(req, callback);
}


/**
 * API: /user/:id/following (DELETE), フォロー削除
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.delete = async (req, res, next) => {
  const callback = {
    success: async ({ follow_id, user_id }) => {
      const following = await models.relationship.destroy({
        where: {
          [Op.and]: [
            { follow_id },
            { user_id }
          ]
        }
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
    failure: msg_list => next(new CommonResponse(400, msg_list)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  relation_validator.delete(req, callback);
};
