import { config } from "./config";
import { ConsumeMessage, Channel, Connection } from "amqplib";
import * as amqp from 'amqplib';
import { logger } from "./common/logger";

let connection = undefined;
let channelPool = undefined;

const getChannel = async (): Promise<Channel> => {
  if (channelPool === undefined) {
    channelPool = await (await getConnection()).createChannel();
  }
  return channelPool
}

const getConnection = async (): Promise<Connection> => {
  if (connection === undefined) {
    connection = await amqp.connect(config.rabbitmq_url);
  }
  return connection
}

export const init = async () => {
  await getConnection()
  await getChannel()
}

export const sendMessage = async (queue: string, message: string): Promise<void> => {
  const channel: Channel = await getChannel()

  await channel.assertQueue(queue, { durable: true });
  try {
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
  } catch (err) {
    logger.error(err.message)
  }
}


export const consume = async (queue: string, handler: (msg: ConsumeMessage) => void): Promise<void> => {
  const channel: Channel = await getChannel()
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, handler);
}

export const ack = async (msg: ConsumeMessage): Promise<void> => {
  const channel: Channel = await getChannel()
  channel.ack(msg);
}