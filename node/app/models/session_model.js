/**
 * セッションテーブル
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize}
 */
module.exports = (sequelize, DataTypes) => {

  let session = sequelize.define('session', {
    session_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    underscored: true,

    timestamps: false,
  });

  session.removeAttribute('id');

  return session

};