const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()
  
blogRouter.get('/', async (request, response) => {
  await Blog.find({}).populate('user', {username:1, name:1})
      .then(blogs => {
          response.json(blogs)
      })
      
})

blogRouter.post('/', async (request, response) => {
  try {
  const body = request.body
  console.log('secret variable:',process.env.SECRET)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const creator = await User.findById(decodedToken.id)
  console.log('creator: ', creator)
  const l =  body.likes ? body.likes : 0
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: l,
    user : creator.id
  })
  const saved_blog = await blog.save()
  
  creator.blogs = creator.blogs.concat(saved_blog.id)
  await creator.save()
  response.status(201).json(blog)
  } catch (error) {
    response.status(403).json({error:'incorrect user for this operation'})
  }
})


blogRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token,process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    let res = await Blog.findByIdAndRemove(request.params.id)
    console.log(res)
    response.status(204).end()
  } catch(exception) {
    response.status(400).json({error: 'error occured in deletion, check id and try again'})
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