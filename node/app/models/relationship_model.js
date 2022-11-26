/**
 * リレーションテーブル
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize}
 */
module.exports = (sequelize, DataTypes) => {

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