require('dotenv').config() //load from .env

export interface Config {
  app_name: string;
  rabbitmq_url: string;
  database_url: string;
  port: number;
}

export const config: Config = {
  app_name: process.env.APP_NAME || 'fetcher',
  rabbitmq_url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  database_url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/fetcher',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000
};