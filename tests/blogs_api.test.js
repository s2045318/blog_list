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
    console.log(blogsAtStart)
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    console.log(blogsAtEnd)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.content)
})

test('updating a blog post', async () => {
  const blogs = await helper.blogsInDB()
  const blogToUpdate = blogs[0]
  const updatedBlog = {
    title: 'Updated title',
    author: 'Updated author',
    url: 'http://updated-url.com',
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