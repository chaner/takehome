import { Context } from "koa";
import { FetchUrlJob } from "../db/models/FetchUrlJob";
import { FetchUrlExecution } from "../db/models/FetchUrlExecution";
import { enqueue } from "../services/JobService";

export class JobsController {
  // GET http://localhost:3000/api/v1/jobs/
  public static async index(ctx: Context): Promise<void> {
    try {
      const jobs = await FetchUrlJob.findAll({ order: [['updatedAt', 'DESC']] })
      ctx.status = 200;
      ctx.body = { data: jobs };
      return;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        errors: [error.message]
      };
    }
  }

  // POST http://localhost:3000/api/v1/jobs/
  public static async create(ctx: Context): Promise<void> {
    const { url } = ctx.request.body as any
    try {
      const job = enqueue(url)
      ctx.status = 200;
      ctx.body = { data: job };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        errors: [error.message]
      };
    }
  }

  // GET http://localhost:3000/api/v1/jobs/:jobId
  public static async get(ctx: Context): Promise<void> {
    try {
      const job = await FetchUrlJob.findOne({ where: { id: ctx.params.jobId } })
      ctx.status = 200;
      ctx.body = { data: job };
      return;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        errors: [error]
      };
    }
  }

  // GET http://localhost:3000/api/v1/jobs/:jobId/results
  public static async results(ctx: Context): Promise<void> {
    try {
      const execution = await FetchUrlExecution.findOne({ where: { fetchUrlJobId: ctx.params.jobId }, order: [['createdAt', 'DESC']] })
      ctx.status = 200;
      ctx.body = { data: execution };
      return;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        errors: [error.message]
      };
    }
  }

  // DELETE http://localhost:3000/api/v1/jobs/:jobsId
  public static async delete(ctx: Context): Promise<void> {
    try {
      await FetchUrlJob.destroy({ where: { id: ctx.params.jobId } })
      await FetchUrlExecution.destroy({ where: { fetchUrlJobId: ctx.params.jobId } }) //TODO kind of hacky, didn't have time to figure out how to cascade delete
      ctx.status = 200;
      ctx.body = { data: 'success' };
      return;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        errors: [error.message]
      };
    }
  }
}