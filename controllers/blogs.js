const blogsRouter = require('express').Router()
const { json } = require('express')
const Blog = require('../models/blog.js')
const { error } = require('../utils/logger.js')

blogsRouter.get('/', async (_, response) => {

    const blogs = await Blog.find({})
    response.json(blogs)
        
})

blogsRouter.post('/', async (request, response) => {
    
    const blog = new Blog(request.body)
    const saveBlog = await blog.save()

    response.status(201).json(saveBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id

    const deletedBlog = await Blog.findByIdAndDelete(id)

    if(!deletedBlog) {
        return response.status(404).json({error: 'blog not found'})
    }

    response.status(204).end()
    
})


module.exports = blogsRouter