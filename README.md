# $\color{white}{URL fetcher}$

# SETUP

* Install rabbitmq
  * brew install rabbitmq
* Install postgres
  * brew install pg
* `npm install`
* `npm install sequelize-cli -g`
* `sequelize-cli db:create`
* `sequelize-cli db:migrate`

# Dev
* To run the webserver:
  * `npm run dev`
* To run the worker (rabbit consumer):
  * `npm run devWorker`

# ENDPOINTS

* POST /api/v1/jobs
```
{
  "urls": [
    {"url": "https://gingerlabs.com"},
    {"url": "https://apple.com"},
  ]
}
```
* GET /api/v1/jobs - list
* GET /api/v1/jobs/:jobId - check job details, just the url right now.
* GET /api/v1/jobs/:jobId/results - check status as well as see results of the execution
* DELETE /api/v1/jobs/:jobId


# Eric's Notes
Data Model:
* `FetchUrlJob` - this defines what the job is, there's a unique index on url since that acts as the primary key.
* `FetchUrlExecution` - this may not be necessary depending on the use case, but I figured it could be nice to track changes over time. There could be a clean up chore to clean up old data, or we can modify to overwrite the existing one. Keeping them separate makes it flexible.

Architecture:
* It's a very simple queue that uses rabbitmq and postgres.
1. `FetchUrlJob` `FetchUrlExecution` records are created
2. if `FetchUrlExecution`'s last createdAt date is less than an hour ago, we don't enqueue. Otherwise we put a message onto the queue
3. The `FetchWorker` updates the status, takes the message and fetches the webpage, then saves it.

Areas of Improvement:
* There's no URL validator
* There's no caching
* Code for the rabbit producer and consumer is a bit messy - my first time using it with TS and node. I spent most of my time troubleshooting the local connection. Turns out it doesn't like localhost and needs 127.0.0.1 to resolve the host.
* There's no connection pool for rabbitmq
* I didn't have time to write any serializers, so it's just outputs whatever the database gives us.
* There's no pagination on the list endpoint
* I haven't tested if the build to js actually works. I only used dev mode with ts-node.
* Unit tests