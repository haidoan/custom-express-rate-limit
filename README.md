<h1>Custom Rate Limit for for Express API with Redis</h1>


Rate limit for API call is very important for protect server from expected API calls.
Because this is simple and transparent enough so that I built simple middle ware but you can have a look on the popular NPM package [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit).

**How it works** 

Idea of this middleware is based on the [Token Bucket](https://en.wikipedia.org/wiki/Token_bucket) algorithm which an user has fixed amount of token and using it every fixed amount of time, every api call, 1 token will be deduced, while user has no more token, it will hit rate limit.

You can alway use in-memory but it will not work properly when running multiple instance, so I am using redis in this case.

```
const app = express()
const { limiter } = require('./lib/index')
const MAX_CAPACITY = 10 //
const RATE = 10 //
app.use('/', limiter({ max_capacity: MAX_CAPACITY, rate: RATE }))

```

**Dependencies**
- Redis // can start via docker-compose by the command `docker-compose up -d`
- Express

**How to run**

- start server : `node index.js`
- call API `curl localhost:3000/hi`
    - status code 200 if not success
    - status code 429 if hit rate limited     


**Test**
- run `npm run test`

