import { Sequelize } from 'sequelize-typescript';
import { FetchUrlJob } from "./db/models/FetchUrlJob";
import { config } from "./config";
import { FetchUrlExecution } from './db/models/FetchUrlExecution';

const initConnection = () => {
  const dbUrl = config.database_url;
  if (dbUrl) {
    return new Sequelize(dbUrl, {
      dialect: 'postgres',
      logging: console.log,
      models: [
        FetchUrlJob,
        FetchUrlExecution
      ]
    });
  } else {
    return new Sequelize();
  }
};

export const sequelize = initConnection();