/**
 * @module model
 * @desc テーブル管理
 */
const { Sequelize, DataTypes } = require('sequelize');
const { DB } = require('config');
const log = require('../logs');


DB.DB_OPTIONS.logging = msg => log.app.info(msg);

const sequelize = new Sequelize(
  DB.DB_NAME,
  DB.DB_USER,
  DB.DB_PASSWORD,
  DB.DB_OPTIONS
);

// connection confirm
try {
  sequelize.authenticate();
  log.app.info('Connection has been established successfully.');
} catch(err) {
  log.app.error('Unable to connect to the database:', err);
}


module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,

  user: require('./user_model')(sequelize, DataTypes),
  session: require('./session_model')(sequelize, DataTypes),
  relationship: require('./relationship_model')(sequelize, DataTypes),
  tweet: require('./tweet_model')(sequelize, DataTypes),
  favorite: require('./favorite_model')(sequelize, DataTypes)

};

// association
(m => {

  m.session.belongsTo(m.user);
  m.user.hasMany(m.session);

  m.user.hasMany(m.tweet, {
    sourceKey: 'id',
    foreignKey: 'user_id'
  });
  m.tweet.belongsTo(m.user, {
    targetKey: 'id',
    foreignKey: 'user_id'
  });

  // m.user.belongsToMany(m.tweet, {
  //   through: m.favorite,
  //   as: 'active_favorite'
  // });
  // m.tweet.belongsToMany(m.user, {
  //   through: m.favorite,
  //   as: 'passive_favorite'
  // });

  m.user.belongsToMany(m.user, {
    through: m.relationship,
    as: 'follow',
    foreignKey: 'following_id'
  });
  m.user.belongsToMany(m.user, {
    through: m.relationship,
    as: 'follower',
    foreignKey: 'follower_id'
  });

})(module.exports);