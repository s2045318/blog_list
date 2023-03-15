const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const User = require('../models/user')

//...

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
      name: 'Matti Luukkainen',
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

test('length of username', async () => {
        const newUser = {
            username: 'TS',
            name : 'Rikka',
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
        name : 'Mikki G',
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