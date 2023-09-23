const express = require('express');
const router = express.Router();
const { request } = require('./app/filters');
const controllers = require('./app/controllers');

/**
 * セッション管理
 */
// ログインAPI
router.post('/login',
  controllers.session.create
);
// ログアウトAPI
router.delete('/logout',
  request.cookieCheck,
  controllers.session.delete
);
// セッション確認API
router.post('/session',
  request.cookieCheck,
  controllers.session.search
);

/**
 * ユーザ機能
 */
// ユーザ登録API
router.post('/user',
  controllers.user.create
);
// ユーザ詳細取得API
router.get('/user/:id',
  controllers.user.show
);
// ユーザ更新API
router.put('/user',
  request.cookieCheck,
  controllers.user.update
);
// ユーザ一覧取得API
router.get('/users',
  controllers.user.index
);

/**
 * フォロー機能
 */
// フォロー一覧取得API
router.get('/user/:id/followings',
  controllers.relation.followings
);
// フォロワー一覧取得API
router.get('/user/:id/followers',
  controllers.relation.followers
);
// フォロー登録
router.post('/user/:id/following',
  request.cookieCheck,
  controllers.relation.create
);
// フォロー削除
router.delete('/user/:id/following',
  request.cookieCheck,
  controllers.relation.delete
);

/**
 * ツイート機能
 */
// ツイートAPI
router.post('/tweet',
  request.cookieCheck,
  controllers.tweet.create
);
// ツイート詳細取得API
router.get('/tweet/:id',
  controllers.tweet.show
);
// ツイート削除API
router.delete('/tweet/:id',
  request.cookieCheck,
  controllers.tweet.delete
);
// ツイート一覧API
router.get('/tweets',
  controllers.tweet.index
);
// ツイート一覧（ログインユーザ）
router.get('/tweets/user',
  request.cookieCheck,
  controllers.tweet.home
);

/**
 * お気に入り機能
 */
// お気に入り登録API
router.post('/tweet/:id/favorite',
  request.cookieCheck,
  controllers.favorite.create
);
// お気に入り削除API
router.delete('/tweet/:id/favorite',
  request.cookieCheck,
  controllers.favorite.delete
);
// お気に入り一覧取得API
router.get('/user/:id/favorites',
  controllers.favorite.index
);

module.exports = router;
