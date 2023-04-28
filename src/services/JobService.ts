import { logger } from "../common/logger";
import { FetchUrlExecution } from "../db/models/FetchUrlExecution"
import { FetchUrlJob } from "../db/models/FetchUrlJob"
import { ack, consume, sendMessage } from "../rabbit";
import axios from "axios";

const QUEUE_NAME = 'fetch-url'
export type JobStatus = 'started' | 'finished' | 'failed'

interface JobPayload {
  url: string;
}

// Find a job with the same url, create an execution if last executed an hour ago
export const enqueue = async (urls: JobPayload[]) => {
  const cleaned = urls.map((url) => ({ url: url.url })) //remove other attributes
  await FetchUrlJob.bulkCreate(cleaned, { ignoreDuplicates: true, returning: true }) //pg doesn't return ids if the record already exists, even if returning is true
  const jobs = await FetchUrlJob.findAll({ where: { url: cleaned.map((url) => url.url) } }) //have to refetch to get ids
  jobs.forEach((job) => {
    sendMessage(QUEUE_NAME, JSON.stringify({ jobId: job.id, url: job.url }))
  })
  return jobs
}

// Takes a job id and fetch the url contents, store it.
const executeJob = async (message: any) => {
  const job = await FetchUrlJob.findOne({ where: { id: message.jobId } })
  if (!job) {
    throw new Error(`Job with id ${message.jobId} not found`)
  }
  const lastExecution = await FetchUrlExecution.findOne({ where: { fetchUrlJobId: job.id, status: 'finished' }, order: [['updatedAt', 'DESC']] })
  if (lastExecution && lastExecution.createdAt > new Date(Date.now() - 1000 * 60 * 60)) {
    logger.info(`Skipping ${job.url} because it was executed less than an hour ago`)
    return;
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

export const deleteJob = async (jobId: string) => {
  await FetchUrlJob.destroy({ where: { id: jobId } })
  await FetchUrlExecution.destroy({ where: { fetchUrlJobId: jobId } }) //TODO kind of hacky, didn't have time to figure out how to cascade delete
}

export const startConsumer = async () => {
  consume(QUEUE_NAME, async (msg) => {
    const message = JSON.parse(JSON.parse(msg.content.toString()))
    executeJob(message)
    ack(msg);
  })
}