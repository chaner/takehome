import bodyParser from "koa-bodyparser";
import koaJson from "koa-json";
import { routes } from "./routes";
import { startServer } from "./server";
import { init } from "./rabbit";
require('./config')
require('./database')

init();

export const app = startServer((app) => {
  app.use(bodyParser());
  app.use(koaJson({ pretty: false, param: "pretty" }));

  //rabbitmq
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (process.env.NODE_ENV !== "development") {
        //TODO FIXME airbrake/datadog
      } else {
        console.error(err);
      }
      ctx.status = 500;
      ctx.body = err;
    }
  });
  app.use(routes.routes());
});