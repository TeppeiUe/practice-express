const controllers = require('./app/controllers');

/**
 * ルーティング管理
 * @param {Express} app
 */
module.exports = app => {
  app.post('/user', controllers.user.create);
  app.get('/user/:id', controllers.user.show);
  app.get('/users', controllers.user.index);

  app.post('/tweet', controllers.tweet.create);
  app.get('/tweet/:id', controllers.tweet.show);
  app.get('/tweets', controllers.tweet.index);

  app.post('/tweet/:id/favorite', controllers.favorite.create);
  app.delete('/tweet/:id/favorite', controllers.favorite.delete);
};