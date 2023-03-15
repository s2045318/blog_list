const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (username.length < 3) {
    console.log('username is less then 3 characters long')
    response.status(400)
    response.send()
  } else if (password.length< 3) {
    console.log('password is less then 3 characters long')
    response.status(400)
    response.send()
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
    console.log('saved user:', username)
    response.send()
  }
})

module.exports = usersRouter