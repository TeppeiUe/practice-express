const models = require('../models');
const { Op } = models.Sequelize;
const log = require('../logs');


/**
 * API: /tweet/:id/favorite (POST), お気に入り登録
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.create = async (req, res, next) => {

  const { user_id, tweet_id } = req.body;

  const [_, created] = await models.favorite.findOrCreate({
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

  return res.json({ create: created ? 1 : 0 })
};


/**
 * API: /user/:id/favorite, お気に入りツイート一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.index = async (req, res, next) => {

  const user_id = req.params.id;

  const favorite = await models.user.findByPk(user_id, {
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
}


/**
 * API: /tweet/:id/favorite (DELETE), お気に入り削除
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.delete = async (req, res, next) => {

  const { user_id, tweet_id } = req.body;

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

  return res.json({ delete: favorite })
};