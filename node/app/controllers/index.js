/**
 * @module controller
 * @desc コントローラー管理
 */
module.exports = {
  session: require('./session_controller'),
  user: require('./user_controller'),
  tweet: require('./tweet_controller'),
  favorite: require('./favorite_controller'),
  relation: require('./relationship_controller'),
};