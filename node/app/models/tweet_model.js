const { Sequelize, DataTypes } = require('sequelize');

/**
 * ツイートテーブル
 * @param {Sequelize} sequelize
 */
module.exports = sequelize => {

  return sequelize.define('tweet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [1, 140] },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    underscored: true,

    updatedAt: false,
    createdAt: 'created_at',
  })

};