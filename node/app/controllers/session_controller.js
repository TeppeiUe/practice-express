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
 * @returns {ServerResponse} json
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
            'message',
            'created_at'
          ],
          order: [
            ['created_at', 'desc']
          ]
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
          'profile',
          'created_at'
        ]
      })
      .catch(err => {
        log.app.error(err.stack);
        return res.status(500).json({ message: 'system error' })
      });

      if (user) {
        return session.create(user.id, async (ret, err) => {

          if (err) {
            log.app.error(err);
            return res.status(500).json({ message: 'system error' })

          } else {
            const { session_id, expires } = ret;

            res.cookie('session_id', session_id, {
              expires: new Date(expires),
              httpOnly: WEB.COOKIE.SECURE
            });

            return res.json({ user })
          }

        })
      } else {
        return res.status(401).json(null)

      }
    },
    failure: msg_list => res.status(401).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  session_validator.create(req, callback);

};


/**
 * API: /session (POST), セッションチェック
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.search = async (req, res, next) => {

  const user = await models.user.findByPk(req.current_user.id, {
      include: {
        model: models.tweet,
        attributes: [
          'id',
          'message',
          'created_at'
        ],
        order: [
          ['created_at', 'desc']
        ],
    },
  })
  .catch(err => {
    log.app.error(err.stack);
    return res.status(500).json({ message: 'system error' })
  });

  return user ? res.json({ user }) : res.status(401).json(null)

};


/**
 * API: /logout (DELETE), ログアウト
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.delete = async (req, res, next) => {

  const callback = {
    success: async () => {
      await session.delete(req.cookies.session_id, ret => {
        if (ret) {
          log.app.error(ret);
          return res.status(500).json({ message: 'system error' })

        } else {
          res.clearCookie('session_id');
          return res.status(204).end();

        }

      });
    },
    failure: msg_list => res.status(401).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  session_validator.delete(req, callback);

};