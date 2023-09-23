/**
 * 検証用エラークラス
 * @extends {Error}
 */
class ValidationError extends Error {
  /**
   * @constructor
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

module.exports = ValidationError;
