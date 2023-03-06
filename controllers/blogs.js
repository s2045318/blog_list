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


blogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})


blogRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      likes : body.likes,
      url : body.url 
    }
    console.log('about to find and update')
    await Blog.findByIdAndUpdate(body.id, blog, { new: true })
    response.status(200)
  } catch(exception) {
      response.status(400)
  }
})
module.exports = blogRouter