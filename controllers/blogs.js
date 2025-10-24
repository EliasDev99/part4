const blogsRouter = require('express').Router()
const { json } = require('express')
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (_, response) => {

    const blogs = await Blog.find({})
    response.json(blogs)
        
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

module.exports = blogsRouter