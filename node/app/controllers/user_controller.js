const models = require('../models');
const log = require('../logs');
const { user_validator } = require('../filters');
const { session } = require('../services');
const { WEB } = require('config');


/**
 * API: /user, ユーザー登録
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.create = async (req, res, next) => {

  const callback = {
    success: async obj => {
      const user = await models.user.create(obj)
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
            const { id, user_name, image, profile, created_at } = user;

            res.cookie('session_id', session_id, {
              expires: new Date(expires),
              httpOnly: WEB.COOKIE.SECURE
            });

            res.location('/user/' + id);

            res.status(201).json({
              user: {
                ...{
                  id,
                  user_name,
                  image,
                  profile,
                  created_at
                },
                tweets: [],
                favorites: [],
              },
            });

          }

        })
      } else {
        res.status(400).json({ message: ['signup failure'] });

      }
    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  user_validator.create(req, callback);

};


/**
 * API: /user/:id, ユーザー情報
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.show = async (req, res, next) => {

  const callback = {
    success: async () => {
      const user = await models.user.findByPk(req.params.id, {
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
              'image',
              'profile'
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
        res.status(500).json({ message: ['system error'] });
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
          tweets: tweets.map(
            ({ id, user_id, message, created_at, passive_favorite }) => ({
              ...{
                id,
                user_id,
                message,
                created_at
              },
              favorites: passive_favorite.map(
                ({ id, user_name, image, profile }) =>
                ({ id, user_name, image, profile })
              ),
            })
          ).sort((p, c) => p.created_at < c.created_at ? 1 : -1),
        },
      });

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  user_validator.show(req, callback);

};


/**
 * API: /user (PUT), ユーザー情報更新
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.update = async (req, res, next) => {

  const callback = {
    success: async obj => {
      await models.user.update(
        obj, {
        where: {
          id: req.current_user.id
        },
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
  };

  user_validator.update(req, callback);

};


/**
 * API: /users, ユーザー一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.index = async (req, res, next) => {

  const users = await models.user.findAll({
    attributes: [
      'id',
      'user_name',
      'image',
      'profile',
      'created_at'
    ],
    order: [
      ['created_at', 'desc']
    ]
  })
  .catch(err => {
    log.app.error(err.stack);
    res.status(500).json({ message: ['system error'] });
  });

  res.json({ users });

};