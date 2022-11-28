const { session } = require('../services');
const log = require('../logs');
const { WEB } = require('config');


/**
 * cookieチェック
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse}
 */
module.exports.cookie_check = async (req, res, next) => {
  const { path, method } = req;

  log.access.info(`request url=[${path}] method=[${method}]`);

  if (method.toUpperCase() === 'GET' ||
      (path === '/user' && method.toUpperCase() === 'POST') ||
      path === '/login' ||
      path === '/logout'
  ) {
    next();
    return null

  }

  const { session_id } = req.cookies;

  if (session_id === undefined) {
    log.app.info('cookie is not found');
    res.status(401).json({ message: ['cookie is not found'] });

  } else {
    await session.search(session_id, (ret, err) => {

      if (err) {
        log.app.error(err.stack);
        res.status(500).json({ message: ['system error'] });

      } else {
        if (ret) {
          const { user_id, expires } = ret;

          res.cookie('session_id', session_id, {
            expires: new Date(expires),
            httpOnly: WEB.COOKIE.SECURE
          });

          // 後続のミドルウェアで使用予定
          req.current_user = { id: user_id };

          next();

        } else {
          res.status(401).json({ message: ['session out'] });

        }

      }

    })

  }

};