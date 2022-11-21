const models = require('../models');
const log = require('../logs');

/**
 * API: /user, ユーザー登録
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.create = async (req, res, next) => {

  const { user_name, email, password } = req.body;

  const user = await models.user.create({
    user_name,
    email,
    password,
  })
  .catch(err => {
    log.app.error(err.stack);
    return res.status(500).json({ message: 'system error' })
  });

  return res.json({ user })
};


/**
 * API: /user/:id, ユーザー情報
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.show = async (req, res, next) => {

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

};


/**
 * API: /user/:id (PUT), ユーザー情報更新
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.update = async (req, res, next) => {

  const { user_name, profile, image } = req.body;

  const [_, user] = await models.user.update({
    user_name,
    profile,
    image,
  }, {
    where: {
      id: req.params.id
    },
    returning: true,
    plain: true,
  })
  .catch(err => {
    log.app.error(err);
    return res.status(500).json({ message: 'system error' })
  });

  return res.json(user)

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