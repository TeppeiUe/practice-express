const {
  NODE_DOMAIN_NAME=localhost,
  NODE_PORT=3000,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
} = process.env

module.exports = {
  WEB: {
    PORT: NODE_PORT,
    TLS: false,
    COOKIE: {
      NAME: 'session_id',
      SAME_SITE: 'none',
      DOMAIN: NODE_DOMAIN_NAME,
      EXPIRES: {
        UNIT: 'm',
        VALUE: 30
      }
    },
    PASSWORD: {
      SECURE: true,
      SALT: 'practice',
    }
  },
  DB: {
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_OPTIONS: {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'postgres',
      timezone: '+09:00',
    }
  },
  LOG: {
    LEVEL: 'all',
    SETTING: {
      appenders: {
        access: {
          type: 'dateFile',
          filename: './logger/access.log',
          pattern: '-yyyy-MM-dd',
          layout: {
            type: 'pattern',
            pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}][%p]%] %m %h (%f{2}:%l)'
          }
        },
        app: {
          type: 'dateFile',
          filename: './logger/system.log',
          pattern: '-yyyy-MM-dd',
          layout: {
            type: 'pattern',
            pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}][%p]%] %m (%f{2}:%l)'
          }
        },
        console: {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}][%c][%p]%] %m (%f{2}:%l)'
          }
        }
      },
      categories: {
        access: {
          appenders: [/*'access',*/ 'console'],
          level: 'all',
          enableCallStack: true
        },
        app: {
          appenders: ['app', 'console'],
          level: 'all',
          enableCallStack: true
        },
        default: {
          appenders: ['console'],
          level: 'all',
          enableCallStack: true
        }
      }
    }
  },
};