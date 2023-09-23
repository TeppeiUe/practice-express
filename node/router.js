const express = require('express');
const { request } = require('./app/filters');
const controllers = require('./app/controllers');

/**
 * ルーティング管理
 * @param {express.Express} app
 */
module.exports = app => {
  app.post('/login', controllers.session.create);
  app.delete('/logout',request.cookie_check, controllers.session.delete);
  app.post('/session', request.cookie_check, controllers.session.search);

  app.post('/user', controllers.user.create);
  app.get('/user/:id', controllers.user.show);
  app.put('/user', request.cookie_check, controllers.user.update);
  app.get('/users', controllers.user.index);

  app.get('/user/:id/favorites', controllers.favorite.index);
  app.get('/user/:id/followings', controllers.relation.followings);
  app.get('/user/:id/followers', controllers.relation.followers);
  app.post('/user/:id/following', request.cookie_check, controllers.relation.create);
  app.delete('/user/:id/following', request.cookie_check, controllers.relation.delete);

  app.post('/tweet', request.cookie_check, controllers.tweet.create);
  app.get('/tweet/:id', controllers.tweet.show);
  app.delete('/tweet/:id', request.cookie_check, controllers.tweet.delete);
  app.get('/tweets', controllers.tweet.index);
  app.get('/tweets/user', request.cookie_check, controllers.tweet.home);

  app.post('/tweet/:id/favorite', request.cookie_check, controllers.favorite.create);
  app.delete('/tweet/:id/favorite', request.cookie_check, controllers.favorite.delete);
};
