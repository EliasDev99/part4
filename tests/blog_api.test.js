const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
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

test('should respond 400 if title is missing', async () => { 
     const newBlog = {
        "author": "Matti",
        "url": "https://example.com/blog1",
        "likes": 18
    }

     await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
 })

 test('should respond 400 if url is missing', async () => { 
     const newBlog = {
         "title": "Test POST Blog",
        "author": "Matti",
        "likes": 18
    }

     await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
 })

 describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const title = blogsAtEnd.map( blog => blog.title)

      assert(!title.includes(blogToDelete.title))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

   test('Updates a blog with a valid id', async () => { 
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        
        const updatedBlog = {
            "title": "Updated Blog",
            "author": "Matti",
            "url": "https://example.com/blog1",
            "likes": blogToUpdate.likes + 1
         }

        const response =   await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog) 
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        assert.strictEqual(response.body.title, updatedBlog.title)
        assert.strictEqual(response.body.likes, updatedBlog.likes)

        // Verify DB actually updated
        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlogData = blogsAtEnd.find(b => b.id === blogToUpdate.id)
        assert.strictEqual(updatedBlogData.title, updatedBlogData.title)
 })





after(async () => {
  await mongoose.connection.close()
})