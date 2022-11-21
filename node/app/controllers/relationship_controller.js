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

  const { following_id, follower_id } = req.body;

  const [follow, _] = await models.relationship.findOrCreate({
    where: {
      [Op.and] : [
        { following_id },
        { follower_id }
      ]
    },
    defaults: {
      following_id,
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
 * API: /user/:id/follow (DELETE), フォロー削除
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
 module.exports.delete = async (req, res, next) => {

  const { following_id, follower_id } = req.body;

  const follow = await models.relationship.destroy({
    where: {
      [Op.and]: [
        { following_id },
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