const express = require('express')
const mongoose = require('mongoose')
const app = express()

const { MONGODB_URI } = require('./utils/config.js')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users')

logger.info('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app