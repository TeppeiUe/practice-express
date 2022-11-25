const models = require('../models');
const { Op } = models.Sequelize;
const log = require('../logs');
const { favorite_validator } = require('../filters');


/**
 * API: /tweet/:id/favorite (POST), お気に入り登録
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.create = async (req, res, next) => {

  const callback = {
    success: async ({ user_id, tweet_id }) => {
      await models.favorite.findOrCreate({
        where: {
          [Op.and]: [
            { user_id },
            { tweet_id }
          ]
        },
        defaults: {
          user_id,
          tweet_id
        }
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

  favorite_validator.create(req, callback);

};


/**
 * API: /user/:id/favorite, お気に入りツイート一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.index = async (req, res, next) => {

  const callback = {
    success: async ({ id }) => {
      const favorite = await models.user.findByPk(id, {
        include: {
          model: models.tweet,
          as: 'active_favorite',
          attributes: [
            'id',
            'message',
            'user_id',
            'created_at'
          ],
          include: {
            model: models.user,
            attributes: [
              'id',
              'user_name',
              'image'
            ]
          }
        },
      })
      .catch(err => {
        log.app.error(err.stack);
        return res.status(500).json({ message: 'system error' })
      });

      return res.json({ favorite })
    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  favorite_validator.index(req, callback);

}


/**
 * API: /tweet/:id/favorite (DELETE), お気に入り削除
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.delete = async (req, res, next) => {

  const callback = {
    success: async ({ user_id, tweet_id }) => {
      const favorite = await models.favorite.destroy({
        where: {
          [Op.and]: [
            { user_id },
            { tweet_id }
          ]
        }
      })
      .catch(err => {
        log.app.error(err.stack);
        return res.status(500).json({ message: 'system error' })
      });

      return favorite ? res.status(204).end() :
        res.status(400).json({ message: ['favorite tweet is not found']})

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  favorite_validator.delete(req, callback);

};