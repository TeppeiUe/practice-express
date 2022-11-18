/**
 * server entry point
 */
const express = require('express');
const app = express();
const { WEB } = require('config');
const log = require('./app/logs');

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