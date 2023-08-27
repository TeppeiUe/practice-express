const { Sequelize, DataTypes } = require('sequelize');

/**
 * お気に入りテーブル
 * @param {Sequelize} sequelize
 */
module.exports = sequelize => {

  let favorite = sequelize.define('favorite', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tweet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    underscored: true,

    updatedAt: false,
    createdAt: 'created_at',
  });

  favorite.removeAttribute('id');

  return favorite

};