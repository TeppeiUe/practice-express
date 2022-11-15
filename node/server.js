const express = require('express');
const app = express();
const { WEB, DB } = require('config');


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
  console.log('Connection has been established successfully.');
} catch(err) {
  console.error('Unable to connect to the database:', err);
}


app.listen(WEB.PORT, () => console.log(`Running at port: ${WEB.PORT}`));