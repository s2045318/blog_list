const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
//const jwt = require('jsonwebtoken')
const middle = require('../utils/middleware')
//const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, personName: 1})
  if (blogs) {
    response.json(blogs)
  } else {
    response.status(404).end()
  }
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  }
  else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middle.userExtractor, async (request, response) => {
  const body = request.body
  const user = await User.findById(request.user)
  if (user === null) return response.status(401).send({error:'permission denied for posting'})
  console.log(user)
  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
    })

  const addedBlog = await blog.save()
  user.blogs = user.blogs.concat(addedBlog._id)
  await user.save()
  
  response.status(201).json(addedBlog)
  
})
	
blogsRouter.delete('/:id', middle.userExtractor, async (request, response, next) => {
  try {
    const user = await User.findById(request.user)
    if (user === null) return response.status(401).send({error:'upermission denied for deletion'})
    const userID = user.id.toString()
    const blogToDelete = await Blog.findById(request.params.id)
    if (blogToDelete.user.toString() === userID) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'Access denied, user does not have permission' })
  }
  }
  catch (error) {
    return response.status(401).json({ error: 'Access denied, user does not have permission'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body
    const user = body.user ? body.user.id : null
    console.log('user: ',user)
    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user : user
    }
    
    console.log(request.params.id)
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
    response.status(201).json(updatedBlog)
  } catch (error){
    console.log(error)
  }
})

module.exports = blogsRouter