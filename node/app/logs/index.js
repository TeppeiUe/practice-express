const log4js = require('log4js');
const { LOG } = require('config');

log4js.configure(LOG.SETTING);
log4js.levels = LOG.LEVEL;

module.exports = {
  app: log4js.getLogger('app'),
  access: log4js.getLogger('access'),
};