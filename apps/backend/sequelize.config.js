
const config = {

  development: { dialect: process.env['FSMS_DATABASE_DIALECT'],
    host: process.env['FSMS_DATABASE_HOST'],
    username: process.env['FSMS_DATABASE_USERNAME'],
    password: process.env['FSMS_DATABASE_PASSWORD'],
    database: process.env['FSMS_DATABASE_DATABASE'],
    port: process.env['FSMS_DATABASE_PORT'],
    paranoid: true
  },

  production: {
    // Production database configuration
  },
};

module.exports = config;
