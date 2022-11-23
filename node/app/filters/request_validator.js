const { session } = require('../services');
const log = require('../logs');
const { WEB } = require('config');


/**
 * cookieチェック
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {NextFunction} next
 * @returns {ServerResponse} json
 */
module.exports.cookie_check = (req, res, next) => {

  log.access.info(`request url=[${req.path}] method=[${req.method}]`);

  if (req.method.toUpperCase() === 'GET' ||
      req.path === '/login') {
    next();
    return null

  }

  const { session_id } = req.cookies;

  if (session_id === undefined) {
    log.app.info('cookie is not found');
    return res.status(401).json({ message: 'cookie is not found' })

  } else {
    log.app.info(`request cookie is ${session_id}`);

    return session.search(session_id, (ret, err) => {

      if (err) {
        log.app.error(err.stack);
        return res.status(500).json({ message: 'system error' })

      } else {
        if (ret) {
          const { user_id, expires } = ret;
          log.app.info(`session table has user_id: ${user_id}`);

          res.cookie('session_id', session_id, {
            expires: new Date(expires),
            httpOnly: WEB.COOKIE.SECURE
          });

          // 後続のミドルウェアで使用予定
          req.current_user = { id: user_id };

          next();
          return null

        } else {
          return res.status(401).json(null)

        }

      }

    })

  }

};