/**
 * create table
 */
(async () => {
  const models = require('./app/models');
  const log = require('./app/logs');

  await models.sequelize.sync({ force: true }, err => {
    log.app.error(`models instance error: ${err}`)
  });

  log.app.info('complete init table.');
})();
