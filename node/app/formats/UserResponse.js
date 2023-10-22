const TweetBaseModel = require('./TweetBaseModel');
const UserBaseModel = require('./UserBaseModel');

/**
 * user tweet item
 * @extends {TweetBaseModel}
 */
class UserTweetItem extends TweetBaseModel {
  /**
   * favorite users
   * @type {UserBaseModel[]}
   */
  favorites;

  /**
   * @constructor
   * @param {any} tweet
   */
  constructor(tweet) {
    super(tweet);
    const { passive_favorite } = tweet;
    this.favorites = passive_favorite.map(user => new UserBaseModel(user));
  }
}

/**
 * user response model
 * @extends {UserBaseModel}
 */
class UserResponse extends UserBaseModel {
  /**
   * user tweets
   * @type {UserTweetItem[]}
   */
  tweets;

  /**
   * @constructor
   * @param {any} user
   */
  constructor(user) {
    super(user);
    const { tweets } = user;
    this.tweets = tweets
      .map(tweet => new UserTweetItem(tweet))
      .sort((p, c) => p.created_at < c.created_at ? 1 : -1);
  }
}

module.exports = UserResponse;
