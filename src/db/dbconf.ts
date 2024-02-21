
import {  SequelizeOptions } from 'sequelize-typescript';
import { Kwh, Authorize, Elcontrol,Car,Users } from '../models/models';
export const dbConf:SequelizeOptions = {
    dialect: 'sqlite',
    storage: './database.db',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    models: [Users,Car,Kwh,Authorize,Elcontrol]
  }