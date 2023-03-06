# Custom Rate Limit for for Express API with Redis for Sanbong24h.vn
Simple rate limit middleware with express for the [Sanbong24h.vn](https://sanbong24h.vn)


Rate limit for API call is very important for protect server from expected API calls. This simple rate limit is using in [sanbong24h.vn](https://sanbong24h.vn)
Because this is simple and transparent enough so that I built simple middleware but you can have a look on the popular NPM package [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit).

**How it works** 

Idea of this middleware is based on the [Token Bucket](https://en.wikipedia.org/wiki/Token_bucket) algorithm which an user has fixed amount of token and using it every fixed amount of time, every api call, 1 token will be deduced, while user has no more token, it will hit rate limit.

You can alway use in-memory but it will not work properly when running multiple instance, so I am using redis in this case.

```
const app = express()
const { limiter } = require('./lib/index')
const MAX_CAPACITY = 10 // maximum number of api call allow in a second
const RATE = 1 // number of token will be refilled every second
app.use('/', limiter({ max_capacity: MAX_CAPACITY, rate: RATE }))

```

**Dependencies**
- Redis // can start via docker-compose by the command `docker-compose up -d`
- Express

**How to run**

- start server : `node index.js`
- call API `curl localhost:3000/hi`
    - http status code 200 if not success
    - http status code 429 if hit rate limited     


**Test**
- run `npm run test`

