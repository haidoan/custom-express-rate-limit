const { get, set } = require('./redis')

/**
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next -  Express next function
 * @returns return next() or throw 429 http status code
 */
const limiter = async (req, res, next) => {
    const config = req.app.get('config');
    const MAX_CAPACITY = config.max_capacity;  // max api call / second
    const RATE = config.rate; // number of token refilled after 1 second
    const user = req.headers['user_id']; // user id used as key in redis
    // get current cache data of user
    const data = await get(user)
    const nowTs = Math.floor(Date.now() / 1000)
    if (!data) {
        const firstTimeData = { 
            tokens: MAX_CAPACITY - 1, // at first user will have a bucket with capacity = MAX_CAPACITY
            last_ts: nowTs // save time stamp of the last api
         }
        await set(user, firstTimeData)
        return next();
    }
    
    const { last_ts, tokens } = data;
    // every second user bucket will be refilled with RATE tokens
    // so calculate number of token missing since the last API call to now
    const offsetTokens = parseInt((nowTs - last_ts) * RATE);
    // select min of (missing token + current token) vs MAX_CAPACITY
    const newCapacity = Math.min(tokens + offsetTokens, MAX_CAPACITY);
    if (newCapacity === 0) {
        // if no more token available -> rate limit, other wise go next()
        return res.status(429).send({ status: 'rate limit' })
    }
    // save user token
    await set(user, { last_ts: nowTs, tokens: newCapacity - 1 })
    next()
}

module.exports = { limiter } 
