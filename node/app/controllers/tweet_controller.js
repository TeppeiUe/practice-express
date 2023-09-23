const express = require('express');
const models = require('../models');
const { Op } = models.Sequelize;
const log = require('../logs');
const { tweet_validator } = require('../filters');
const CommonResponse = require('../formats/CommonResponse');
const TweetBaseModel = require('../formats/TweetBaseModel');
const TweetResponse = require('../formats/TweetResponse');
const { DB } = require('config');
const { attributes } = DB.USER_TABLE;
const { order } = DB.COMMON_TABLE;

/**
 * API: /tweet, ツイート
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.create = async (req, res, next) => {
  const callback = {
    success: async obj => {
      const tweet = await models.tweet.create(obj)
      .catch(err => {
        log.app.error(err.stack);
        next(new CommonResponse);
      });

      res.location(`/tweet/${tweet.id}`);
      res.status(201).json({
        tweet: new TweetBaseModel(tweet),
      });
    },
    failure: msg_list => next(new CommonResponse(400, msg_list)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  tweet_validator.create(req, callback);
};


/**
 * API: /tweet/:id, ツイート詳細
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.show = async (req, res, next) => {
  const callback = {
    success: async obj => {
      const tweet = await models.tweet.findOne({
        include: [
          {
            model: models.user,
            attributes,
          },
          {
            model: models.user,
            as: 'passive_favorite',
            attributes,
          }
        ],
        where: obj,
      })
      .catch(err => {
        log.app.error(err.stack);
        next(new CommonResponse);
      });

      res.json({
        tweet: new TweetResponse(tweet),
      });
    },
    failure: msg_list => next(new CommonResponse(400, msg_list)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  };

  tweet_validator.show(req, callback);
};


/**
 * API: /tweets, ツイート一覧
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.index = async (req, res, next) => {
  const tweets = await models.tweet.findAll({
    include: [
      {
        model: models.user,
        attributes,
      },
      {
        model: models.user,
        as: 'passive_favorite',
        attributes,
      }
    ],
    order,
  })
  .catch(err => {
    log.app.error(err.stack);
    next(new CommonResponse);
  });

  res.json({
    tweets: tweets.map(tweet => new TweetResponse(tweet)),
  });
};

/**
 * API: /tweets/user, ツイート一覧(ログインユーザ)
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.home = async (req, res, next) => {
  // ログインユーザのフォロワーユーザを取得
  const users = await models.user.findByPk(req.current_user.id, {
    include: [
      {
        model: models.user,
        as: 'following',
      }
    ],
  })
  .catch(err => {
    log.app.error(err.stack);
    next(new CommonResponse);
  });

  // IN句で指定するuser_idを抽出
  const user_id = users.following.reduce((p, c) =>
    [...p, c.id],
    [req.current_user.id]
  );

  const tweets = await models.tweet.findAll({
    include: [
      {
        model: models.user,
        attributes,
      },
      {
        model: models.user,
        as: 'passive_favorite',
        attributes,
      }
    ],
    where: { user_id },
    order,
  })
  .catch(err => {
    log.app.error(err.stack);
    next(new CommonResponse);
  });

  res.json({
    tweets: tweets.map(tweet => new TweetResponse(tweet)),
  });
};


/**
 * API: /tweet/:id (DELETE), ツイート削除
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports.delete = async (req, res, next) => {
  const callback = {
    success: async ({ tweet_id, user_id }) => {
      await models.sequelize.transaction(async t => {
        const tweet = await models.tweet.findOne({
          where: {
            [Op.and]: [
              { id: tweet_id },
              { user_id }
            ]
          }
        }, {
          transaction: t
        });

        await models.favorite.destroy({
          where: { tweet_id }
        }, {
          transaction: t
        });

        await tweet.destroy({
        }, {
          transaction: t
        });
      })
      .catch(err => {
        log.app.error(err.stack);
        next(new CommonResponse);
      });

      res.status(204).end();
    },
    failure: msg_list => next(new CommonResponse(400, msg_list)),
    error: err => {
      log.app.error(err.stack);
      next(new CommonResponse);
    },
  }

  tweet_validator.delete(req, callback);
};
