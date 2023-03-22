const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const User = require('../models/user')
//   "**/tests/dummy_test.js",
    //  "**/tests/users_api.test.js",

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'mluukkai',
      realname: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('test login',  () => {
  test('incorrect login', async () => {
    const user = {
      username: "hacker",
      realname: 'hacker',
      password: "malicious intent"
    }
    await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
  test('correct login', async () => {
    const user = {
      username: 'mluukkai',
      password: 'salainen'
    }
    await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })
})



test('length of username', async () => {
        const newUser = {
            username: 'TS',
            realname : 'Rikka',
            password : 'Shouldnt matter'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
})

test('length of password', async () => {
    const newUser = {
        username: 'testingtestingonetwo',
        realname : 'Mikki G',
        password : 'SM'
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
})


afterAll(async () => {
    await mongoose.connection.close()
})