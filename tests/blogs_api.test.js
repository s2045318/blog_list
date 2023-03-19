const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const Blog = require('../models/blogs')
let token = null


beforeEach(async () => {
  const user = User.findOne({username:"mluukkai"})
  console.log(user.id)
})

test('blogs are returned as json', async () => {
  const user = {
    username: 'mluukkai',
    password: 'salainen'
  }

  const response = await api.post('/api/login').send(user)
  console.log('user sent')
  const token = response.body.token
  console.log(token)
  await api
    .get('/api/blogs')
    .set({'Authorization': `Bearer ${token}`}) // Set the Authorization header with the token
    .expect(200)
    .expect('Content-Type', /application\/json/)
})



test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()  
  })

test('HTTP POST request to the /api/blogs' , async() => {
    const blog = {
        "title": "Hello World",
        "author": "Jesse Gill",
        "url": "http://hello-world",
        "likes": 10000000
          
    }
    let blogObject = new Blog(blog)
    await blogObject.save()
   // expect(responsePost.body).toBe(blog)
    const responseGet = await api.get('/api/blogs')
    expect(responseGet.body).toHaveLength(helper.initialBlogs.length + 1)

})

test('likes property is missing from the request, it will default to the value 0', async () => {
    const blog = {
      "title": "Hello World",
      "author": "Jesse Gill",
      "url": "http://hello-world"
    }
    let blogObject = new Blog(blog)
    await blogObject.save()
    const response = await api.get('/api/blogs')
    expect(response.status).toBe(200)
    expect(response.body[response.body.length - 1].likes).toBe(0)
  })
  

test('a blog post can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDB()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.content)
})

test('updating a blog post', async () => {
  const blogs = await helper.blogsInDB()
  const blogToUpdate = blogs[0]
  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: 100
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const updatedBlogs = await helper.blogsInDB()
  const updatedPost = updatedBlogs.find(post => post.id === blogToUpdate.id)

  expect(updatedPost.title).toEqual(updatedBlog.title)
  expect(updatedPost.author).toEqual(updatedBlog.author)
  expect(updatedPost.url).toEqual(updatedBlog.url)
  expect(updatedPost.likes).toEqual(updatedBlog.likes)
})


afterAll(async () => {
  await mongoose.connection.close()
})