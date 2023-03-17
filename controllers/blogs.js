const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
  
blogRouter.get('/', async (request, response) => {
  await Blog.find({}).populate('user', {username:1, name:1})
      .then(blogs => {
          response.json(blogs)
      })
      
})


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  console.log(authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    console.log('token:', authorization.replace('Bearer ', ''))
    return authorization.split(' ')[1]
  }
  return null
}

blogRouter.post('/', async (request, response) => {
  const body = request.body
  console.log('secret:',process.env.SECRET)
  console.log(getTokenFrom(request) === process.env.SECRET)
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
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
  response.status(200).json(blog)
})


blogRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    response.statusCode(400).json({error: 'error occured in deletion, check id and try again'})
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