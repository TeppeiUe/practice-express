const controllers = require('./app/controllers');

/**
 * ルーティング管理
 * @param {Express} app
 */
module.exports = app => {
  app.post('/user', controllers.user.create);
  app.get('/user/:id', controllers.user.show);
  app.get('/users', controllers.user.index);
};