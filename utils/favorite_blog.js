const favoriteBlog = (blogs) => { 
    if(blogs.length === 0) return null

    return blogs.reduce((max, blog) => {
       return blog.likes > max.likes ? blog : max
    })
 }

 module.exports = {
  favoriteBlog
}