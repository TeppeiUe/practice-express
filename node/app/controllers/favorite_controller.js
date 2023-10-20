const express = require('express');
const models = require('../models');
const log = require('../logs');
const { favorite_validator } = require('../filters');
const CommonResponse = require('../formats/CommonResponse');
const TweetResponse = require('../formats/TweetResponse');
const { DB } = require('config');
const { attributes } = DB.USER_TABLE;
const { order } = DB.COMMON_TABLE;

/**
 * API: /tweet/:id/favorite (POST), お気に入り登録
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.create = async (req, res, next) => {
  const callback = {
    success: async obj => {
      await models.favorite.findOrCreate({
        where: obj,
        defaults: obj,
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

  favorite_validator.create(req, res, callback);
};


/**
 * API: /user/:id/favorites, お気に入りツイート一覧
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.index = async (req, res, next) => {
  const callback = {
    success: async ({ id, ...obj }) => {
      const favorites = await models.favorite.findOne({
        include: {
          model: models.tweet,
          include: [
            {
              model: models.user,
              attributes,
            }, {
              model: models.user,
              as: 'passive_favorite',
              attributes,
              order,
            },
          ],
        },
        where: {
          user_id: id
        },
        order,
        ...obj,
      })
      .catch(err => {
        log.app.error(err.stack);
        next(new CommonResponse);
      });

      res.json({
        tweets: favorites
          ? favorites.tweets.map(tweet => new TweetResponse(tweet))
          : [],
      });

    },
    failure: msg => next(new CommonResponse(400, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  favorite_validator.index(req, res, callback);
}


/**
 * API: /tweet/:id/favorite (DELETE), お気に入り削除
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.delete = async (req, res, next) => {
  const callback = {
    success: async obj => {
      const favorite = await models.favorite.destroy({
        where: obj,
      })
      .catch(err => {
        log.app.error(err.stack);
        next(new CommonResponse);
      });

      if (favorite) {
        res.status(204).end();
      } else {
        next(new CommonResponse(400, ['favorite tweet is not found']));
      }
    },
    failure: msg => next(new CommonResponse(400, msg)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  favorite_validator.delete(req, res, callback);
};
