const models = require('../models');
const { Op } = models.Sequelize;
const log = require('../logs');
const { WEB } = require('config');
const { session }  = require('../services');
const { session_validator } = require('../filters');


/**
 * API: /login (POST), ログイン
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.create = async (req, res, next) => {

  const callback = {
    success: async obj => {
      const { email, password } = obj;
      const user = await models.user.findOne({
        include: {
          model: models.tweet,
          attributes: [
            'id',
            'user_id',
            'message',
            'created_at'
          ],
          order: [
            ['created_at', 'desc']
          ],
          include: {
            model: models.user,
            as: 'passive_favorite',
            attributes: [
              'id',
              'user_name',
              'image'
            ],
            order: [
              ['created_at', 'desc']
            ],
          },
        },
        where: {
          [Op.and]: [
            { email },
            { password }
          ]
        },
        attributes: [
          'id',
          'user_name',
          'image',
          'profile',
          'created_at'
        ]
      })
      .catch(err => {
        log.app.error(err.stack);
        res.status(500).json({ message: ['system error'] });
      });

      if (user) {
        await session.create(user.id, async (ret, err) => {

          if (err) {
            log.app.error(err);
            res.status(500).json({ message: ['system error'] });

          } else {
            const { session_id, expires } = ret;

            res.cookie('session_id', session_id, {
              expires: new Date(expires),
              httpOnly: WEB.COOKIE.SECURE
            });

            const { id, user_name, image, profile, created_at, tweets } = user;

            res.json({
              user: {
                ...{
                  id,
                  user_name,
                  image,
                  profile,
                  created_at
                },
                tweets: tweets.map(tweet => {
                  const { id, user_id, message, created_at, passive_favorite } = tweet;
                  return {
                    ...{
                      id,
                      user_id,
                      message,
                      created_at
                    },
                    favorites: passive_favorite.map(favorite => {
                      const { id, user_name, image } = favorite;
                      return {
                        id,
                        user_name,
                        image
                      }
                    }),
                  }
                }),
              },
            });

          }

        })
      } else {
        res.status(401).json({ message: ['user is not found'] });

      }
    },
    failure: msg_list => res.status(401).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  session_validator.create(req, callback);

};


/**
 * API: /session (POST), セッションチェック
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.search = async (req, res, next) => {

  const user = await models.user.findByPk(req.current_user.id, {
    include: {
      model: models.tweet,
      attributes: [
        'id',
        'user_id',
        'message',
        'created_at'
      ],
      order: [
        ['created_at', 'desc']
      ],
      include: {
        model: models.user,
        as: 'passive_favorite',
        attributes: [
          'id',
          'user_name',
          'image'
        ],
        order: [
          ['created_at', 'desc']
        ],
      },
    },
    attributes: [
      'id',
      'user_name',
      'image',
      'profile',
      'created_at'
    ],
  })
  .catch(err => {
    log.app.error(err.stack);
    res.status(500).json({ message: ['system error'] })
  });

  if (user) {
    const { id, user_name, image, profile, created_at, tweets } = user;

    res.json({
      user: {
        ...{
          id,
          user_name,
          image,
          profile,
          created_at
        },
        tweets: tweets.map(tweet => {
          const { id, user_id, message, created_at, passive_favorite } = tweet;
          return {
            ...{
              id,
              user_id,
              message,
              created_at
            },
            favorites: passive_favorite.map(favorite => {
              const { id, user_name, image } = favorite;
              return {
                id,
                user_name,
                image
              }
            }),
          }
        }),
      },
    });

  } else {
    res.status(401).json({ message: ['user is not found']});
  }

};


/**
 * API: /logout (DELETE), ログアウト
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.delete = async (req, res, next) => {

  const callback = {
    success: async () => {
      await session.delete(req.cookies.session_id, ret => {
        if (ret) {
          log.app.error(ret);
          res.status(500).json({ message: ['system error'] });

        } else {
          res.clearCookie('session_id');
          res.status(204).end();

        }

      });
    },
    failure: msg_list => res.status(401).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  session_validator.delete(req, callback);

};