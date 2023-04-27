import Koa from "koa";
import { config } from "./config";
import { build } from './logger';

export function startServer(init: (app: Koa) => void): Koa {
  const app = new Koa();
  app.use(build({}))

  app.use(
    require("koa-simple-healthcheck")({
      path: "/health",
      healthy: function () {
        return { everything: "is ok" };
      },
    })
  );

  // Main loop try/catch failsafe
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

  // Give the caller a chance to set it up, and then start it.
  init(app);
  app.listen(config.port);
  console.log('app started')
  return app;
}