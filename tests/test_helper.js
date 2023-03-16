const Blog = require('../models/blogs')
const User = require('../models/user')
const mongoose = require('mongoose')
const rootID = new mongoose.Types.ObjectId()

const initialBlogs = [
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    url: 'https://www.adlibris.com/fi/kirja/the-alchemist-25th-anniversary-edition-9780062355300?gclid=CjwKCAiAmJGgBhAZEiwA1JZolg1JEgl8Fe8Av2KnWu01T3qiwQbpe-hUJmiJLOU55Zr4F7AV8eTT1xoCf6cQAvD_BwE',
    likes: 678,
    user : null
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    url : 'https://www.adlibris.com/fi/kirja/meditations-9780140449334?gclid=CjwKCAiAmJGgBhAZEiwA1JZoloobJ1nIUMO7VJVNXj-cI12_C0__x5DeC6Bh_9hg-nk1vM7yieeD9xoCPSoQAvD_BwE',
    likes: 58,
    user : null
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDB
}

const initialUsers = [
  {
    username: 'wheatyBiscuits',
    name: 'Max',
    password: 'milk&sugar',
    _id : rootID
  },
  {
    username: 'mooMoove',
    name: 'Fredrick',
    password : 'cowsRcool'
  }
]



const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDB,initialUsers,usersInDB
}

