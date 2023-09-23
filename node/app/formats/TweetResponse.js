const TweetBaseModel = require('./TweetBaseModel');
const UserBaseModel = require('./UserBaseModel');

/**
 * tweet response model
 * @extends {TweetBaseModel}
 */
class TweetResponse extends TweetBaseModel {
  /**
   * user information
   * @type {UserBaseModel}
   */
  user;
  /**
   * favorite users
   * @type {UserBaseModel[]}
   */
  favorites;

  /**
   * @constructor
   * @param {any} tweets
   */
  constructor(tweets) {
    super(tweets);
    const { user, passive_favorite } = tweets;
    this.user = new UserBaseModel(user);
    this.favorites = passive_favorite.map(favorite => new UserBaseModel(favorite));
  }
}

module.exports = TweetResponse;
