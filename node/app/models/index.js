/**
 * @module model
 * @desc テーブル管理
 */
const { Sequelize } = require('sequelize');
const { DB } = require('config');
const log = require('../logs');

const {
  DB_OPTIONS,
  DB_NAME,
  DB_USER,
  DB_PASSWORD
} = DB;

DB_OPTIONS.logging = msg => log.app.info(msg);

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_OPTIONS
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

  user: require('./user_model')(sequelize),
  session: require('./session_model')(sequelize),
  relationship: require('./relationship_model')(sequelize),
  tweet: require('./tweet_model')(sequelize),
  favorite: require('./favorite_model')(sequelize)

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

  m.user.belongsToMany(m.tweet, {
    through: m.favorite,
    as: 'active_favorite',
    foreignKey: 'user_id',
    otherKey: 'tweet_id',
  });
  m.tweet.belongsToMany(m.user, {
    through: m.favorite,
    as: 'passive_favorite',
    foreignKey: 'tweet_id',
    otherKey: 'user_id',
  });

  m.user.belongsToMany(m.user, {
    through: m.relationship,
    as: 'following',
    foreignKey: 'user_id',
    otherKey: 'follow_id'
  });
  m.user.belongsToMany(m.user, {
    through: m.relationship,
    as: 'follower',
    foreignKey: 'follow_id',
    otherKey: 'user_id'
  });

})(module.exports);