const { user } = require('../models');
const ValidationError = require('../formats/ValidationError');

/**
 * 存在チェック
 * @param {any} val
 * @param {string} field
 */
module.exports.isRequired = (val, field) => {
  if (val === undefined ||
    val === null ||
    (typeof val === 'string' && val === '')
  ) {
    throw new ValidationError(`${field} is required`);
  }
}

/**
 * user_name check
 * @param {string | number} user_name
 * @param {number | null} user_id
 */
module.exports.userName = async (user_name, user_id = null) => {
  const field = 'user_name';
  this.isRequired(user_name, field);
  this.wordCount(user_name, field, 1, 16);

  // user_nameのunique検証
  await user.findOne({
    where: { user_name },
  })
  .then(u => {
    if ((user_id && u && u.id !== Number(user_id)) || (!user_id && u)) {
      throw new ValidationError(`${field} is already exist`);
    }
  });
}

/**
 * path parameter check
 * @param {string} val
 */
module.exports.pathParameter = val => {
  // pathに:idが存在しない場合404返却のため、存在性チェックは不要
  if (!val.match(/^[1-9]\d*$/)) {
    throw new ValidationError('Invalid parameter');
  }
};

/**
 * query option check
 * @param {string} val
 * @param {string} field
 */
module.exports.queryOption = (val, field) => {
  // query parameterより取得のためプロパティの存在で空白
  if (typeof val === 'string' && !val.match(/^\d+$/)) {
    throw new ValidationError(`Invalid ${field}`);
  }
}

/**
 * word count check
 * @param {string | number} val
 * @param {string} field
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
module.exports.wordCount = (val, field, min, max) => {
  const len = val.length;
  if (min > len || len > max) {
    throw new ValidationError(`${field} must be between ${min} and ${max} characters`);
  }
};
