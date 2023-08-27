const { Sequelize, DataTypes } = require('sequelize');

/**
 * リレーションテーブル
 * @param {Sequelize} sequelize
 */
module.exports = sequelize => {

  let relationship = sequelize.define('relationship', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    follow_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    underscored: true,

    updatedAt: false,
    createdAt: 'created_at',
  })

  relationship.removeAttribute('id');

  return relationship

};