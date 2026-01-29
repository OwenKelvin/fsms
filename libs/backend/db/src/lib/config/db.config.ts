import { SequelizeOptions } from 'sequelize-typescript';

export const dbConfig = {
  dialect: process.env[
    'TAHINIWA_DATABASE_DIALECT'
    ] as SequelizeOptions['dialect'],
  host: process.env['TAHINIWA_DATABASE_HOST'],
  port: Number(process.env['TAHINIWA_DATABASE_PORT']),
  username: process.env['TAHINIWA_DATABASE_USERNAME'],
  password: process.env['TAHINIWA_DATABASE_PASSWORD'],
  database: process.env['TAHINIWA_DATABASE_DATABASE']
};
