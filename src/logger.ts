const morgan = require("morgan");
const mime = require("mime-types");

function jsonFormat(tokens, req, res) {
  const serialization = {
    action: "http.request",
    method: tokens.method(req, res),
    path: tokens.url(req, res),
    status: tokens.status(req, res),
    took: tokens["response-time"](req, res),
    client_ip: tokens["remote-addr"](req, res),
    content_length: tokens.res(req, res, "content-length"),
    format: mime.extension(tokens.res(req, res, "content-type")),
    user_agent: tokens["user-agent"](req, res),
    referrer: tokens["referrer"](req, res),
    ...req.trace,
  };

  return JSON.stringify(serialization);
}


export const build = (opts) => {
  let formatter;

  formatter = morgan(jsonFormat, {});

  const middleware = async (ctx, next) => {
    ctx.logger = opts.logger;
    ctx.req.logger = opts.logger;
    return new Promise((resolve, reject) => {
      formatter(ctx.req, ctx.res, (err) => {
        err ? reject(err) : resolve(ctx)
      })
    }).then(next)
  }

  return middleware;
}