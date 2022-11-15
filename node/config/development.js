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
};