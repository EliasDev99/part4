const Blog = require('../models/blog.js')

const initialBlogs = [
 {
  "title": "First Blog",
  "author": "Alice",
  "url": "https://example.com/blog1",
  "likes": 10
},
{
  "title": "Second Blog",
  "author": "John",
  "url": "https://example.com/blog2",
  "likes": 1
},
{
  "title": "Third Blog",
  "author": "Juha",
  "url": "https://example.com/blog3",
  "likes": 11
}
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }