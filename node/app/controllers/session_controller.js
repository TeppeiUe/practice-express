const express = require('express');
const models = require('../models');
const { Op } = models.Sequelize;
const log = require('../logs');
const { session }  = require('../services');
const { session_validator } = require('../filters');
const CommonResponse = require('../formats/CommonResponse');

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
        include: [
          {
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
                  'image',
                  'profile'
                ],
              },
            },
          },
          {
            model: models.tweet,
            include: {
              model: models.user,
              as: 'passive_favorite',
              attributes: [
                'id',
                'user_name',
                'image',
                'profile'
              ],
            },
            attributes: [
              'id',
              'user_id',
              'message',
              'created_at'
            ],
          },
        ],
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
        next(new CommonResponse);
      });

      if (user) {
        await session.create(user.id, async (ret, err) => {

          if (err) {
            log.app.error(err);
            next(new CommonResponse);

          } else {
            const { session_id, expires } = ret;
            session.setCookie(res, session_id, expires)

            const {
              id,
              user_name,
              image,
              profile,
              created_at,
              following,
            } = user;

            const user_tweets = user.tweets.reduce((arr, t) => [
              ...arr, {
                id: t.id,
                user_id: t.user_id,
                message: t.message,
                created_at: t.created_at,
                favorites: t.passive_favorite.map(u => ({
                  id: u.id,
                  user_name: u.user_name,
                  image: u.image,
                  profile: u.profile
                })),
                user: { id, user_name, image, profile },
              }
            ], []);

            res.json({
              user: {
                ...{
                  id,
                  user_name,
                  image,
                  profile,
                  created_at
                },
                tweets: following
                  .filter(({ tweets }) => tweets.length)
                  .reduce((arr, { id, user_name, image, tweets }) => [
                    ...arr, ...tweets.map(t => {
                      return {
                        id: t.id,
                        user_id: t.user_id,
                        message: t.message,
                        created_at: t.created_at,
                        favorites: t.passive_favorite.map(u => ({
                          id: u.id,
                          user_name: u.user_name,
                          image: u.image,
                          profile: u.profile
                        })),
                        user: { id, user_name, image, profile },
                      }
                    })
                  ], user_tweets)
                  .sort((p, c) => p.created_at < c.created_at ? 1 : -1),
              },
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

  const user = await models.user.findByPk(req.current_user.id, {
    include: [
      {
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
              'image',
              'profile'
            ],
          },
        },
      },
      {
        model: models.tweet,
        include: {
          model: models.user,
          as: 'passive_favorite',
          attributes: [
            'id',
            'user_name',
            'image',
            'profile'
          ],
        },
        attributes: [
          'id',
          'user_id',
          'message',
          'created_at'
        ],
      }
    ],
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
    next(new CommonResponse);
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

    const user_tweets = user.tweets.reduce((arr, t) => [
      ...arr, {
        id: t.id,
        user_id: t.user_id,
        message: t.message,
        created_at: t.created_at,
        favorites: t.passive_favorite.map(u => ({
          id: u.id,
          user_name: u.user_name,
          image: u.image,
          profile: u.profile
        })),
        user: { id, user_name, image, profile },
      }
    ], []);

    res.json({
      user: {
        ...{
          id,
          user_name,
          image,
          profile,
          created_at
        },
        tweets: following
          .filter(({ tweets }) => tweets.length)
          .reduce((arr, { id, user_name, image, tweets }) => [
            ...arr, ...tweets.map(t => {
              return {
                id: t.id,
                user_id: t.user_id,
                message: t.message,
                created_at: t.created_at,
                favorites: t.passive_favorite.map(u => ({
                  id: u.id,
                  user_name: u.user_name,
                  image: u.image,
                  profile: u.profile
                })),
                user: { id, user_name, image, profile },
              }
            })
          ], user_tweets)
          .sort((p, c) => p.created_at < c.created_at ? 1 : -1),
      },
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