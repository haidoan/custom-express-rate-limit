const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.', '.env') })
const express = require('express')
const app = express()

const { limiter } = require('./lib/index')
app.use('/', limiter)
app.get('/hi', (req,res, next) => {
    return res.status(200).send({ message : 'Welcome to the hotel California, you can checkout any time you like but can never leave!'})
})

module.exports = app

