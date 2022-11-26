const controllers = require('./app/controllers');

/**
 * ルーティング管理
 * @param {Express} app
 */
module.exports = app => {
  app.post('/login', controllers.session.create);
  app.delete('/logout', controllers.session.delete);
  app.post('/session', controllers.session.search);

  app.post('/user', controllers.user.create);
  app.get('/user/:id', controllers.user.show);
  app.put('/user', controllers.user.update);
  app.get('/users', controllers.user.index);

  app.get('/user/:id/favorites', controllers.favorite.index);
  app.get('/user/:id/followings', controllers.relation.followings);
  app.get('/user/:id/followers', controllers.relation.followers);
  app.post('/user/:id/following', controllers.relation.create);
  app.delete('/user/:id/following', controllers.relation.delete);

  app.post('/tweet', controllers.tweet.create);
  app.get('/tweet/:id', controllers.tweet.show);
  app.delete('/tweet/:id', controllers.tweet.delete);
  app.get('/tweets', controllers.tweet.index);

  app.post('/tweet/:id/favorite', controllers.favorite.create);
  app.delete('/tweet/:id/favorite', controllers.favorite.delete);
};