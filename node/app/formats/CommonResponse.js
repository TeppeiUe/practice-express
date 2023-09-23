/**
 * 共通レスポンス
 */
class CommonResponse {
  /**
   * statusCode
   * @type {number}
   */
  status;
  /**
   * message
   * @type {string}
   */
  message;

  /**
   * @constructor
   * @param {number} status statusCode
   * @param {string} message message
   */
  constructor(
    status = 500,
    message = 'unexpected error'
  ) {
    this.status = status;
    this.message = message;
  }
}

module.exports = CommonResponse
