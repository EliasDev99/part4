const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (_, response) => {

    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
        
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body
    
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
        return response.status(400).json({ error: 'No users found in database'})
    }

    const blog = new Blog({ title, author, url, likes, user: user._id})
    const saveBlog = await blog.save()

    // update user's blogs array
    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()

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