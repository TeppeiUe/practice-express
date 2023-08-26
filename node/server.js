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
const cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setting for CORS
const corsOptionsDelegate = function (req, callback) {
  const corsOptions = (() => {
    const { ALLOW_ORIGINS, ALLOW_METHODS, ALLOW_HEADERS } = WEB.CORS;
    
    if (ALLOW_ORIGINS.indexOf(req.headers.origin) !== -1) {
      return {
        // Access-Control-Allow-Origin
        origin: true,
        // Access-Control-Allow-Methods
        methods: ALLOW_METHODS,
        // Access-Control-Allow-Headers
        allowedHeaders: ALLOW_HEADERS,
        // Access-Control-Allow-Credentials
        credentials: true,
      }
    } else {
      return { origin: false }
    }
  })();
  
  callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));

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
