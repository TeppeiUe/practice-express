module.exports = {
  WEB: {
    PORT: process.env.NODE_PORT || 3000,
  },
  DB: {
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_OPTIONS: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
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