# $\color{white}{URL fetcher}$

# SETUP

* Install rabbitmq
  * brew install rabbitmq
* Install postgres
  * brew install pg

# ENDPOINTS

POST /api/v1/jobs
```
[
  {"url": "https://gingerlabs.com"},
  {"url": "https://apple.com"},
]
```
GET /api/v1/jobs
GET /api/v1/jobs/:jobId
GET /api/v1/jobs/:jobId/results
DELETE /api/v1/jobs/:jobId


```Create a service containing a job queue. Each job will consist of fetching data from a URL and storing the results.

The service should expose REST or GraphQL API endpoints for:
- adding a new job (should take the target URL as an argument)
- checking the status of an existing job
- retrieving the results of a completed job.
- deleting a job

If a URL has been submitted within the last hour, do not fetch the data again.

The API should also support batch requests for new jobs (i.e. you should be able to add jobs for several URLs at once).

We want to respect your time, so please do not spend more than 3 hours on this. If you reach the 3 hour mark and it is incomplete that's fine - please send us what you have.

Regardless of how much you finish, please include a description of what your next steps would be if you were to spend more time on the project and why.

Please send any questions you have to colin@gingerlabs.com, and submit the project to via Dropbox/Google Drive/etc, or github (cgilboy). Thanks!```