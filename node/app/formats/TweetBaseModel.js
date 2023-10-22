/**
 * tweet db model
 */
class TweetBaseModel {
  /**
   * tweet id
   * @type {number}
   */
  id;
  /**
   * tweet
   * @type {string}
   */
  message;
  /**
   * user id
   * @type {number}
   */
  user_id;
  /**
   * created datetime
   * @type {Date}
   */
  created_at;

  /**
   * constructor
   * @param {any} tweet
   */
  constructor(tweet) {
    const { id, message, user_id, created_at } = tweet;
    this.id = id;
    this.message = message;
    this.user_id = user_id;
    this.created_at = created_at;
  }
}

module.exports = TweetBaseModel;
