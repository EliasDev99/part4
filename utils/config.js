const { error } = require('./logger.js')

require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

if (!MONGODB_URI) {
  error('⚠️  MONGODB_URI not set in environment variables')
}

module.exports = { MONGODB_URI, PORT }
