const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.', '.env') })
const { initRedis } = require('./lib/redis')
const app = require('./app')
const port  = process.env.PORT
const http = require('http')
const MAX_CAPACITY = 3 // maximum 3 api call / second
const RATE = 1 // 1 token was refilled each every second
let server;

const startServer = () => {
  const redisClient = initRedis()
  app.set('config', {
    client: redisClient,
    max_capacity: MAX_CAPACITY,
    rate: RATE
  })
  server = http.createServer(app)
  server.listen(3000, () => {
    try {
      console.log(`Server start at port ${port} at mode ${process.env.NODE_ENV}`)
    } catch (error) {
      console.log('App failed to start error ', error)
      process.exit(1)
    }
  })
}

startServer()
