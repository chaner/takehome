import { Context } from "koa";
import { FetchUrlJob } from "../db/models/FetchUrlJob";
import { FetchUrlExecution } from "../db/models/FetchUrlExecution";
import { deleteJob, enqueue } from "../services/JobService";

export class JobsController {
  // GET http://localhost:3000/api/v1/jobs/
  public static async index(ctx: Context): Promise<void> {
    const jobs = await FetchUrlJob.findAll({ order: [['updatedAt', 'DESC']] })
    ctx.status = 200;
    ctx.body = { data: jobs };
    return;
  }

  // POST http://localhost:3000/api/v1/jobs/
  public static async create(ctx: Context): Promise<void> {
    const { urls } = ctx.request.body as any

    const job = enqueue(urls)
    ctx.status = 200;
    ctx.body = {
      data: (await job).map((job) => {
        return { id: job.id, url: job.url }
      })
    };
  }

  // GET http://localhost:3000/api/v1/jobs/:jobId
  public static async get(ctx: Context): Promise<void> {
    const job = await FetchUrlJob.findOne({ where: { id: ctx.params.jobId } })
    ctx.status = 200;
    ctx.body = { data: job };
    return;
  }

  // GET http://localhost:3000/api/v1/jobs/:jobId/results
  public static async results(ctx: Context): Promise<void> {
    const execution = await FetchUrlExecution.findOne({ where: { fetchUrlJobId: ctx.params.jobId }, order: [['createdAt', 'DESC']] })
    if (!execution) {
      ctx.status = 404;
      ctx.body = { errors: [`No results found for job ${ctx.params.jobId}`] };
      return;
    }
    ctx.status = 200;
    ctx.body = { data: execution };
    return;
  }

  // DELETE http://localhost:3000/api/v1/jobs/:jobsId
  public static async delete(ctx: Context): Promise<void> {
    await deleteJob(ctx.params.jobId)
    ctx.status = 200;
    ctx.body = { data: 'success' };
    return;
  }
}