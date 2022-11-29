const models = require('../models');
const { Op } = models.Sequelize;
const log = require('../logs');
const { relation_validator } = require('../filters');


/**
 * API: /user/:id/following (POST), フォロー
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
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
        res.status(500).json({ message: ['system error'] });
      });

      if (created) {
        res.status(204).end();
      } else {
        res.status(400).json({ message: ['already follow this user'] });
      }

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  relation_validator.create(req, callback);

};


/**
 * API: /user/:id/followings, フォロー一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.followings = async (req, res, next) => {

  const callback = {
    success: async ({ id }) => {
      const user = await models.user.findByPk(id, {
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
          order: [
            ['created_at', 'desc']
          ],
        },
        attributes: []
      })
      .catch(err => {
        log.app.error(err);
        res.status(500).json({ message: ['system error'] });
      });

      res.json({
        users: user.following.map(
          ({ id, user_name, profile, image, created_at }) =>
          ({ id, user_name, profile, image, created_at })
        ),
      });
    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  relation_validator.index(req, callback);

}


/**
 * API: /user/:id/followers, フォロワー一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 */
module.exports.followers = async (req, res, next) => {

  const callback = {
    success: async ({ id }) => {
      const user = await models.user.findByPk(id, {
        include: {
          model: models.user,
          as: 'follower',
          attributes: [
            'id',
            'user_name',
            'profile',
            'image',
            'created_at'
          ],
          order: [
            ['created_at', 'desc']
          ],
        },
        attributes: [],
      })
      .catch(err => {
        log.app.error(err);
        res.status(500).json({ message: ['system error'] });
      });

      res.json({
        users: user.follower.map(
          ({ id, user_name, profile, image, created_at }) =>
          ({ id, user_name, profile, image, created_at })
        ),
      });

    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  relation_validator.index(req, callback);

}


/**
 * API: /user/:id/following (DELETE), フォロー削除
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
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
        res.status(500).json({ message: ['system error'] });
      });

      if (following) {
        res.status(204).end();
      } else {
        res.status(400).json({ message: ['cannot delete'] });
      }
    },
    failure: msg_list => res.status(400).json({ message: msg_list }),
    error: err => {
      log.app.error(err.stack);
      res.status(500).json({ message: ['system error'] });

    },
  };

  relation_validator.delete(req, callback);

};