const models = require('../models');
const log = require('../logs');
const { user_validator } = require('../filters');


/**
 * API: /user, ユーザー登録
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.create = async (req, res, next) => {

  const callback = {
    success: async obj => {
      const user = await models.user.create(obj)
      .catch(err => {
        log.app.error(err.stack);
        return res.status(500).json({ message: 'system error' })
      });

      return res.status(201).json({ user })

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  user_validator.create(req, callback);

};


/**
 * API: /user/:id, ユーザー情報
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.show = async (req, res, next) => {

  const callback = {
    success: async () => {
      const user = await models.user.findByPk(req.params.id, {
        include: {
          model: models.tweet,
          attributes: [
            'id',
            'message',
            'created_at'
          ],
          order: [
            ['created_at', 'desc']
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
        return res.status(500).json({ message: 'system error' })
      });

      return res.json({ user })

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  user_validator.show(req, callback);

};


/**
 * API: /user (PUT), ユーザー情報更新
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
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
        return res.status(500).json({ message: 'system error' })
      });

      return res.status(204).end()

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  user_validator.update(req, callback);

};


/**
 * API: /users, ユーザー一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
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
    return res.status(500).json({ message: 'system error'})
  });

  return res.json({ users })

};