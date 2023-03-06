const request = require('supertest');
const app = require('../app')
const { initRedis, getRedisClient } = require('../lib/redis')

let redisClient;
/* Connecting to the redis at first*/
beforeAll(() => {
  redisClient = initRedis();
});

const MAX_CAPACITY = 3;
const RATE = 1;

/* Testing the API endpoints. */
describe(`Test API call with maximum ${MAX_CAPACITY} calls / second`, () => {
  const getRandomUserId = () => {
    return Math.floor(Math.random() * 1000).toString();
  }

  app.set('config', {
    client: redisClient,
    max_capacity: MAX_CAPACITY,
    rate: RATE
  })

  it(`Should be success with less than ${MAX_CAPACITY} call / second`, async () => {
    const userId = getRandomUserId()
    let count = 0;
    const tries = MAX_CAPACITY
    // try to call 3 apis within 1 second
    for (let i = 0; i < tries; i++) {
      const res = await request(app)
        .get("/hi")
        .set('user_id', userId);
        if(res.statusCode === 200) {
          count ++;
        }
    }
    expect(count).toBe(tries);
  });

  it(`Should hit rate limit with more than ${MAX_CAPACITY} API call / second`, async () => {
    const userId = getRandomUserId()
    let count = 0;
    const tries = MAX_CAPACITY + 1
    const statusCodes = []
    // try to call 4 apis within 1 second
    for (let i = 0; i < tries; i++) {
      const res = await request(app)
        .get("/hi")
        .set('user_id', userId);
        statusCodes.push(res.statusCode);
    }
    expect(statusCodes[0]).toBe(200); // ok
    expect(statusCodes[1]).toBe(200); // still ok
    expect(statusCodes[2]).toBe(200); // still ok
    expect(statusCodes[3]).toBe(429); // rate limit
  });
});

/* Close redis connection */
afterAll(done => {
  getRedisClient().disconnect()
  done();
})
