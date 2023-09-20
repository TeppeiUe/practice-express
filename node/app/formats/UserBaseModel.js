/**
 * user db model
 */
class UserBaseModel {
  /**
   * user id
   * @type {number}
   */
  id;
  /**
   * user name
   * @type {string}
   */
  user_name;
  /**
   * user profile
   * @type {string}
   */
  profile;
  /**
   * user image
   * @type {string}
   */
  image;
  /**
   * created datetime
   * @type {Date}
   */
  created_at;

  /**
   * @constructor
   * @param {any} user
   */
  constructor(user) {
    const { id, user_name, profile, image, created_at } = user;
    this.id = id;
    this.user_name = user_name;
    this.profile = profile || '';
    this.image = image || '';
    this.created_at = created_at;
  }
}

module.exports = UserBaseModel;
