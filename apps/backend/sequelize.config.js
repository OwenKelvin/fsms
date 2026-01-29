
const config = {

  development: { dialect: process.env['TAHINIWA_DATABASE_DIALECT'],
    host: process.env['TAHINIWA_DATABASE_HOST'],
    username: process.env['TAHINIWA_DATABASE_USERNAME'],
    password: process.env['TAHINIWA_DATABASE_PASSWORD'],
    database: process.env['TAHINIWA_DATABASE_DATABASE'],
    port: process.env['TAHINIWA_DATABASE_PORT'],
    paranoid: true
  },

  production: {
    // Production database configuration
  },
};

module.exports = config;
