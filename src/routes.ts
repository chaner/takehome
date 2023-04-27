import { Context } from "koa";
import Router from "koa-router";
import { JobsController } from "./controllers/JobsController";

const routes = new Router({ prefix: "/api/v1/" });
//prompt
routes.post('createJob', "jobs", JobsController.create)
routes.get('listJobs', "jobs", JobsController.index)
routes.get('getJob', "jobs/:jobId", JobsController.get)
routes.get('getJobResults', "jobs/:jobId/results", JobsController.results)
routes.delete('getJobResults', "jobs/:jobId", JobsController.delete)

export { routes };