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
    const l =  body.likes ? body.likes : 0
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: l    
    })
    blog
        .save()
        .then(result => {
          response.status(201).json(result)
        })
        .catch(error => next(error))
    })


blogRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})


blogRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes
    }
    
    const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    if (result) {
      response.json(result)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})





module.exports = blogRouter