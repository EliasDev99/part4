const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


test('should return all blogs in JSON format', async () => {
    const response = await api
        .get('/api/blogs') 
        .expect(200)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('should return blogs with id property instead of MongoDB _id', async () => {
    const response = await api
        .get('/api/blogs') 
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogs = response.body
        assert.ok(blogs.every(b => b.id))
})

test('create a new blog post and blogs in the system is increased by one', async () => {
    const newBlog = {
        "title": "Test POST Blog",
        "author": "Matti",
        "url": "https://example.com/blog1",
        "likes": 18
    }

    await api
        .post('/api/blogs')
        .send(newBlog) 
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .get('/api/blogs')    

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)    
})

test('default likes to 0 if not provided', async () => {
    const newBlog = {
        "title": "Test POST Blog",
        "author": "Matti",
        "url": "https://example.com/blog1"
    }

    const response =   await api
        .post('/api/blogs')
        .send(newBlog) 
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.likes, 0)

})

after(async () => {
  await mongoose.connection.close()
})