import { SequelizeOptions } from 'sequelize-typescript';

export const dbConfig = {
  dialect: process.env['FSMS_DATABASE_DIALECT'] as SequelizeOptions['dialect'],
  host: process.env['FSMS_DATABASE_HOST'],
  port: Number(process.env['FSMS_DATABASE_PORT']),
  username: process.env['FSMS_DATABASE_USERNAME'],
  password: process.env['FSMS_DATABASE_PASSWORD'],
  database: process.env['FSMS_DATABASE_DATABASE'],
};
