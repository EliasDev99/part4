const _ = require('lodash')

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const groupedByAuthor = _.groupBy(blogs, 'author')

    const authorBlogCounter = _.map(groupedByAuthor, (posts, author) => ({
        author,
        blogs: posts.length
    }))

    return _.maxBy(authorBlogCounter, 'blogs') // find the author with most blogs
}

module.exports = { mostBlogs }