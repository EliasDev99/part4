const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const { userExtractor } = require('../utils/middleware.js')

blogsRouter.get('/', async (_, response) => {

    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
        
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const { title, author, url, likes } = request.body
    const user = request.user 

    const blog = new Blog({ title, author, url, likes, user: user._id})
    const saveBlog = await blog.save()

    // update user's blogs array
    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()

    response.status(201).json(saveBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found'})
    }

    if (blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'permission denied' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const blog = request.body 

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {new: true, runValidators: true})

    if(!updatedBlog) {
        return response.status(404).json({error: 'blog not found'})
     }

    response.status(200).json(updatedBlog)
    
})


module.exports = blogsRouter