const blogsRouter = require('express').Router()
const { json } = require('express')
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (_, response) => {

    const blogs = await Blog.find({})
    response.json(blogs)
        
})

blogsRouter.post('/', async (request, response) => {
    
    const blog = new Blog(request.body)
    const saveBlog = await blog.save()

    response.status(201).json(saveBlog)
})

module.exports = blogsRouter