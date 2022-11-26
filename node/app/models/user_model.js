/**
 * ユーザーテーブル
 * @param {Sequelize} sequelize
 * @param {Sequelize.DataTypes} DataTypes
 * @returns {Sequelize}
 */
module.exports = (sequelize, DataTypes) => {

  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true,
      validate: { len: [1, 16] },
    },
    image: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    profile: {
      type: DataTypes.TEXT,
      defaultValue: '',
      validate: { len: [0, 140] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    underscored: true,

    updatedAt: false,
    createdAt: 'created_at',
  })

};