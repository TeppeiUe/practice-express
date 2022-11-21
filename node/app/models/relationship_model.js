/**
 * リレーションテーブル
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize}
 */
module.exports = (sequelize, DataTypes) => {

  let relationship = sequelize.define('relationship', {
    following_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    underscored: true,

    timestamps: false,
  })

  relationship.removeAttribute('id');

  return relationship

};