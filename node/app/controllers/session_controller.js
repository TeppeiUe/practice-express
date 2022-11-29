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
    success: async ({ email, password }) => {
      const user = await models.user.findOne({
        include: {
          model: models.user,
          as: 'following',
          attributes: [
            'id',
            'user_name',
            'profile',
            'image',
            'created_at'
          ],
          include: {
            model: models.tweet,
            include: {
              model: models.user,
              as: 'passive_favorite',
              attributes: [
                'id',
                'user_name',
                'image'
              ],
            },
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

            const {
              id,
              user_name,
              image,
              profile,
              created_at,
              following,
            } = user;

            res.json({
              user: {
                ...{
                  id,
                  user_name,
                  image,
                  profile,
                  created_at
                },
                tweets: following.filter(({ tweets }) => tweets.length)
                  .reduce((arr, { id, user_name, image, tweets }) => [
                    ...arr, ...tweets.map(t => {
                      return {
                        tweet: {
                          id: t.id,
                          user_id: t.user_id,
                          message: t.message,
                          created_at: t.created_at,
                          favorites: t.passive_favorite.map(u => ({
                            id: u.id,
                            user_name: u.user_name,
                            image: u.image
                          })),
                        },
                        ...{ id, user_name, image },
                      }
                    })
                  ], [])
                  .sort((p, c) =>
                    p.tweet.created_at < c.tweet.created_at ? 1 : -1),              },
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
      model: models.user,
      as: 'following',
      attributes: [
        'id',
        'user_name',
        'profile',
        'image',
        'created_at'
      ],
      include: {
        model: models.tweet,
        include: {
          model: models.user,
          as: 'passive_favorite',
          attributes: [
            'id',
            'user_name',
            'image'
          ],
        },
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
    const {
      id,
      user_name,
      image,
      profile,
      created_at,
      following,
    } = user;

    res.json({
      user: {
        ...{
          id,
          user_name,
          image,
          profile,
          created_at
        },
        tweets: following.filter(({ tweets }) => tweets.length)
          .reduce((arr, { id, user_name, image, tweets }) => [
            ...arr, ...tweets.map(t => {
              return {
                tweet: {
                  id: t.id,
                  user_id: t.user_id,
                  message: t.message,
                  created_at: t.created_at,
                  favorites: t.passive_favorite.map(u => ({
                    id: u.id,
                    user_name: u.user_name,
                    image: u.image
                  })),
                },
                ...{ id, user_name, image },
              }
            })
          ], [])
          .sort((p, c) =>
            p.tweet.created_at < c.tweet.created_at ? 1 : -1),
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