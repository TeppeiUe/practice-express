const models = require('../models');
const log = require('../logs');


/**
 * API: /tweet, ツイート
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.create = async (req, res, next) => {

  const { message, user_id } = req.body;
  const tweet = await models.tweet.create({
    message,
    user_id
  })
  .catch(err => {
    log.app.error(err.stack);
    return res.status(500).json({ message: 'system error' })
  });

  return res.json({ tweet })

};


/**
 * API: /tweet/:id, ツイート詳細
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.show = async (req, res, next) => {

  const tweet = await models.tweet.findOne({
    include: [
      {
        model: models.user,
        attributes: [
          'id',
          'user_name',
          'image'
        ],
      },
      {
        model: models.user,
        as: 'passive_favorite',
        attributes: [
          'id',
          'user_name',
          'image'
        ],
      }
    ],
    attributes: [
      'id',
      'message',
      'user_id',
      'created_at'
    ],
    where: {
      id: req.params.id
    },
  })
  .catch(err => {
    log.app.error(err.stack);
    return res.status(500).json({ message: 'system error' })
  });

  return res.json({ tweet })

};


/**
 * API: /tweets, ツイート一覧
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.index = async (req, res, next) => {

  const tweets = await models.tweet.findAll({
    include: [
      {
        model: models.user,
        attributes: [
          'id',
          'user_name',
          'image'
        ]
      },
      {
        model: models.user,
        as: 'passive_favorite',
        attributes: [
          'id',
          'user_name',
          'image'
        ]
      }
    ],
    attributes: [
      'id',
      'message',
      'created_at',
      'created_at'
    ],
    order: [
      ['created_at', 'desc']
    ],
  })
  .catch(err => {
    log.app.error(err.stack);
    return res.status(500).json({ message: 'system error' })
  });

  return res.json({ tweets })

};