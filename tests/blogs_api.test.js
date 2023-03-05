const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blogs')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body)
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
    const responsePost = await blogObject.save()
   // expect(responsePost.body).toBe(blog)
    const responseGet = await api.get('/api/blogs')
    expect(responseGet.body).toHaveLength(helper.initialBlogs.length + 1)

})

afterAll(async () => {
  await mongoose.connection.close()
})