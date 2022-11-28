const { sequelize, Sequelize, ...models } = require('../models');
const log = require('../logs');
const { tweet_validator } = require('../filters');


/**
 * API: /tweet, ツイート
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.create = async (req, res, next) => {

  const callback = {
    success: async obj => {
      const tweet = await models.tweet.create(obj, {
        attributes: [
          'id',
          'user_id',
          'message',
          'created_at'
        ],
        include: {
          model: models.user,
          attributes: [
            'id',
            'user_name',
            'image'
          ],
        },
      })
      .catch(err => {
        log.app.error(err.stack);
        res.status(500).json({ message: ['system error'] });
      });

      const { id, user_id, message, created_at, user } = tweet;

      res.location('/tweet/' + id);

      res.status(201).json({
        ...{
          id,
          user_id,
          message,
          created_at,
          user,
        },
        favorites: [],
      });

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  tweet_validator.create(req, callback);

};


/**
 * API: /tweet/:id, ツイート詳細
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.show = async (req, res, next) => {

  const callback = {
    success: async obj => {
      const tweet = await models.tweet.findOne({
        include: [
          {
            model: models.user,
            attributes: [
              'id',
              'user_name',
              'image'
            ],
          },
          {
            model: models.user,
            as: 'passive_favorite',
            attributes: [
              'id',
              'user_name',
              'image'
            ],
          }
        ],
        attributes: [
          'id',
          'message',
          'user_id',
          'created_at'
        ],
        where: obj,
      })
      .catch(err => {
        log.app.error(err.stack);
        res.status(500).json({ message: ['system error'] });
      });

      const {
        id,
        user_id,
        message,
        created_at,
        user,
        passive_favorite
      } = tweet;

      res.json({
        tweet: {
          ...{
            id,
            user_id,
            message,
            created_at,
            user,
          },
          favorites: passive_favorite.map(
            ({ id, user_name, image }) =>
            ({ id, user_name, image })
          ),
        },
      });

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  tweet_validator.show(req, callback);

};


/**
 * API: /tweets, ツイート一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.index = async (req, res, next) => {

  const tweets = await models.tweet.findAll({
    include: [
      {
        model: models.user,
        attributes: [
          'id',
          'user_name',
          'image'
        ]
      },
      {
        model: models.user,
        as: 'passive_favorite',
        attributes: [
          'id',
          'user_name',
          'image'
        ]
      }
    ],
    attributes: [
      'id',
      'user_id',
      'message',
      'created_at',
    ],
    order: [
      ['created_at', 'desc']
    ],
  })
  .catch(err => {
    log.app.error(err.stack);
    res.status(500).json({ message: ['system error'] });
  });

  res.json({
    tweets: tweets.map(
      ({ id, user_id, message, created_at, user, passive_favorite }) => ({
        ...{
          id,
          user_id,
          message,
          created_at,
          user,
        },
        favorites: passive_favorite.map(
          ({ id, user_name, image }) =>
          ({ id, user_name, image })
        ),
      })
    ),
  });

};


/**
 * API: /tweet/:id (DELETE), ツイート削除
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.delete = async (req, res, next) => {

  const callback = {
    success: async ({ tweet_id, user_id }) => {
      await sequelize.transaction(async t => {
        const tweet = await models.tweet.findOne({
          where: {
            [Sequelize.Op.and]: [
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
        res.status(500).json({ message: ['system error'] });
      });

      res.status(204).end();

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });
    },
  }

  tweet_validator.delete(req, callback);

};