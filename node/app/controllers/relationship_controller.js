const models = require('../models');
const { Op } = models.Sequelize;
const log = require('../logs');


/**
 * API: /user/:id/follow (POST), フォロー
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.create = async (req, res, next) => {

  const { follow_id, follower_id } = req.body;

  const [follow, _] = await models.relationship.findOrCreate({
    where: {
      [Op.and] : [
        { follow_id },
        { follower_id }
      ]
    },
    defaults: {
      follow_id,
      follower_id
    }
  })
  .catch(err => {
    log.app.error(err);
    return res.status(500).json({ message: 'system error' })
  });

  return res.json({ follow })
};


/**
 * API: /user/:id/follow, フォロー一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse}
 */
module.exports.follow = async (req, res, next) => {

  const follow = await models.user.findByPk(req.params.id, {
    include: {
      model: models.user,
      as: 'follow',
      attributes: [
        'id',
        'user_name',
        'profile',
        'image'
      ]
    },
    attributes: []
  })
  .catch(err => {
    log.app.error(err);
    return res.status(500).json({ message: 'system error' })
  });

  return res.json(follow)
}


/**
 * API: /user/:id/follower
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse}
 */
module.exports.follower = async (req, res, next) => {

  const follower = await models.user.findByPk(req.params.id, {
    include: {
      model: models.user,
      as: 'follower',
      attributes: [
        'id',
        'user_name',
        'profile',
        'image'
      ]
    },
    attributes: [],
  })
  .catch(err => {
    log.app.error(err);
    return res.status(500).json({ message: 'system error' })
  });

  return res.json(follower)
}


/**
 * API: /user/:id/follow (DELETE), フォロー削除
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
 module.exports.delete = async (req, res, next) => {

  const { follow_id, follower_id } = req.body;

  const follow = await models.relationship.destroy({
    where: {
      [Op.and]: [
        { follow_id },
        { follower_id }
      ]
    }
  })
  .catch(err => {
    log.app.error(err.stack);
    return res.status(500).json({ message: 'system error' })
  });

  return res.json( { delete: follow })
};