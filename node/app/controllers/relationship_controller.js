const models = require('../models');
const { Op } = models.Sequelize;
const log = require('../logs');
const { relation_validator } = require('../filters');


/**
 * API: /user/:id/following (POST), フォロー
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.create = async (req, res, next) => {

  const callback = {
    success: async ({ follow_id, user_id }) => {
      const [_, created] = await models.relationship.findOrCreate({
        where: {
          [Op.and] : [
            { follow_id },
            { user_id }
          ]
        },
        defaults: {
          follow_id,
          user_id
        }
      })
      .catch(err => {
        log.app.error(err);
        return res.status(500).json({ message: 'system error' })
      });

      return created ? res.status(204).end() :
        res.status(400).json({ message: ['already follow this user'] })

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  relation_validator.create(req, callback);

};


/**
 * API: /user/:id/followings, フォロー一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse}
 */
module.exports.followings = async (req, res, next) => {

  const callback = {
    success: async ({ id }) => {
      const followings = await models.user.findByPk(id, {
        include: {
          model: models.user,
          as: 'following',
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

      return res.json(followings)
    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  relation_validator.index(req, callback);

}


/**
 * API: /user/:id/followers, フォロワー一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse}
 */
module.exports.followers = async (req, res, next) => {

  const callback = {
    success: async ({ id }) => {
      const followers = await models.user.findByPk(id, {
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

      return res.json(followers)

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  relation_validator.index(req, callback);

}


/**
 * API: /user/:id/following (DELETE), フォロー削除
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
 module.exports.delete = async (req, res, next) => {

  const callback = {
    success: async ({ follow_id, user_id }) => {
      const following = await models.relationship.destroy({
        where: {
          [Op.and]: [
            { follow_id },
            { user_id }
          ]
        }
      })
      .catch(err => {
        log.app.error(err.stack);
        return res.status(500).json({ message: 'system error' })
      });

      return following ? res.status(204).end() :
        res.status(400).json({ message: ['cannot delete'] })
    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      return res.status(500).json({ message: 'system error' })

    },
  };

  relation_validator.delete(req, callback);

};