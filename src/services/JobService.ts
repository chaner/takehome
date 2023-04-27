import { logger } from "../common/logger";
import { FetchUrlExecution } from "../db/models/FetchUrlExecution"
import { FetchUrlJob } from "../db/models/FetchUrlJob"
import { ack, consume, sendMessage } from "../rabbit";
import axios from "axios";

const QUEUE_NAME = 'fetch-url'
export type JobStatus = 'started' | 'finished' | 'failed'

// Find a job with the same url, create an execution if last executed an hour ago
export const enqueue = async (url: string) => {
  const [job, created] = await FetchUrlJob.findOrCreate({ where: { url } })
  const lastExecution = await FetchUrlExecution.findOne({ where: { fetchUrlJobId: job.id, status: 'finished' }, order: [['updatedAt', 'DESC']] })
  if (lastExecution && lastExecution.createdAt > new Date(Date.now() - 1000 * 60 * 60)) {
    throw new Error(`Job last executed less than an hour ago: ${lastExecution.createdAt}`)
  }
  sendMessage(QUEUE_NAME, JSON.stringify({ jobId: job.id, url }))
  return job
}

// Takes a job id and fetch the url contents, store it.
const executeJob = async (message: any) => {
  const job = await FetchUrlJob.findOne({ where: { id: message.jobId } })
  if (!job) {
    throw new Error(`Job with id ${message.jobId} not found`)
  }
  const execution = await FetchUrlExecution.create({ fetchUrlJobId: message.jobId, status: 'started' })
  try {
    logger.info(`Fetching ${job.url}`)
    const html = await axios.get(job.url)
    execution.html = html.data
    execution.status = 'finished'
  } catch (e) {
    execution.error = e.message;
    execution.status = 'failed'
  } finally {
    execution.save()
  }
}

export const startConsumer = async () => {
  consume(QUEUE_NAME, async (msg) => {
    const message = JSON.parse(JSON.parse(msg.content.toString()))
    executeJob(message)
    ack(msg);
  })
}