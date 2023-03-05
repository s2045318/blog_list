const blogRouter = require('express').Router()
const Blog = require('../models/blogs')

  
blogRouter.get('/', async (request, response) => {
  await Blog.find({})
      .then(blogs => {
          response.json(blogs)
      })
      
})

blogRouter.post('/', (request, response, next) => {
    const body = request.body
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes    
    })
    blog
        .save()
        .then(result => {
          response.status(201).json(result)
        })
        .catch(error => next(error))
    })

module.exports = blogRouter