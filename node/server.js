const express = require('express');
const app = express();
const { WEB, DB } = require('config');
const log = require('./app/logs');


const { Sequelize } = require('sequelize');
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


app.listen(WEB.PORT, () => log.app.info(`Running at port: ${WEB.PORT}`));