const mongoose = require('mongoose')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('secret', 10)
  await new User({ username: 'root', name: 'Matti', passwordHash }).save()
})

describe('creating a new user', () => {
    
  test('fails if a username is missing', async () => {
    const newUser = { password: 'secret' }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(response.body.error, /Username is required/)
  })

  test('If password is too short', async () => {
    const newUser = { username: 'sisu', password: '12' }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(response.body.error, /Password must be at least 3 characters long/)
  })

    test('If username is too short', async () => {
    const newUser = { username: 'si', password: '1234' }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(response.body.error, /username must be at least 3 characters long/)
  })

  test('fails if username already exists', async () => {
    const newUser = { username: 'root', password: '123454' }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(response.body.error, /Username must be unique/)
  })
})

after(async () => {
  await mongoose.connection.close()
})
