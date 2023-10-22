/**
 * server entry point
 */
const express = require('express');
const app = express();
const { WEB } = require('config');
const log = require('./app/logs');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const CommonResponse = require('./app/formats/CommonResponse');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Get corsOptions
 * @param {express.Request} req
 * @param {any} callback
 */
const corsOptionsDelegate = (req, callback) => {
  const corsOptions = (() => {
    const { ALLOW_ORIGINS, ALLOW_METHODS, ALLOW_HEADERS } = WEB.CORS;

    if (ALLOW_ORIGINS.indexOf(req.headers.origin) !== -1) {
      return {
        // Access-Control-Allow-Origin
        origin: true,
        // Access-Control-Allow-Methods
        methods: ALLOW_METHODS,
        // Access-Control-Allow-Headers
        allowedHeaders: ALLOW_HEADERS,
        // Access-Control-Allow-Credentials
        credentials: true,
      }
    } else {
      return { origin: false }
    }
  })();

  callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));

// router
app.use(WEB.CONTEXT_PATH, require('./router'));
// 404 error handler
app.all('*', (req, res) => {
  log.access.error('not found');
  res.status(404).end();
});

/**
 * error handler
 * @param {CommonResponse} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  log.access.error(JSON.stringify(err));
  const { status, message } = err;
  res.status(status).json({ message });
};
app.use(errorHandler);

const server = (() => {
  if (WEB.TLS) {
    const fs = require('fs');
    return require('https').createServer({
      key: fs.readFileSync(`${__dirname}/privateKey.pem`),
      cert: fs.readFileSync(`${__dirname}/cert.pem`),
    }, app);

  } else {
    return require('http').createServer(app);
  }
})();

server.listen(WEB.PORT, () =>
  log.app.info(`Running at TLS: ${WEB.TLS}, PORT: ${WEB.PORT}`)
);
