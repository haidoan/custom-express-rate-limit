const Redis = require('ioredis')
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = process.env.REDIS_PORT
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
let redisClient

const initRedis = () => {
  redisClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
  })
  redisClient.on('connect', function () {
    console.log('Redis client connected ')
  })

  redisClient.on('error', function (err) {
    console.error('Redis Something went wrong ', process.env.SERVER_NAME, err)
    process.exit(1)
  })
  return redisClient;
}

const getRedisClient = () => {
  return redisClient
}

const get = async (ip) => {
    const data = await redisClient.get(ip)
    return JSON.parse(data);
}

const set = async (ip, data) => {
    await redisClient.set(ip, JSON.stringify(data))
}

module.exports = { initRedis, getRedisClient, get, set }
