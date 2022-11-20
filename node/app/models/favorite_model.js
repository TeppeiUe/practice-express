/**
 * お気に入りテーブル
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize}
 */
module.exports = (sequelize, DataTypes) => {

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

    timestamps: false,
  });

  favorite.removeAttribute('id');

  return favorite

};