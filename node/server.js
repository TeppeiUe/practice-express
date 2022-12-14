/**
 * server entry point
 */
const express = require('express');
const app = express();
const { WEB } = require('config');
const log = require('./app/logs');
const cookieParser = require('cookie-parser');
const { request } = require('./app/filters');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setting for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(request.cookie_check);
require('./router')(app);

app.listen(WEB.PORT, () => log.app.info(`Running at port: ${WEB.PORT}`));

// db init
if (process.argv[2] === 'init_db') {
  (async () => {
    const models = require('./app/models');
    await models.sequelize.sync({force: true}, err => {
      log.app.error(`models instance error: ${err}`)
    });
    log.app.info('complete init table.');
  })();
}