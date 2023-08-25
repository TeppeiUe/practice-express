/**
 * server entry point
 */
const express = require('express');
const app = express();
const { WEB } = require('config');
const log = require('./app/logs');
const cookieParser = require('cookie-parser');
const { request } = require('./app/filters');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setting for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(request.cookie_check);
require('./router')(app);


const server = (() => {
  if (WEB.TLS) {
    const fs = require('fs');
    return require('https').createServer({
      key: fs.readFileSync(`${__dirname}/privateKey.pem`),
      cert: fs.readFileSync(`${__dirname}/cert.pem`),
    }, app);

  } else {
    return require('http').createServer(app);
  }
})();

server.listen(WEB.PORT, () => 
  log.app.info(`Running at TLS: ${WEB.TLS}, PORT: ${WEB.PORT}`)
);
