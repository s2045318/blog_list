const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  
  if (username.length < 3) {
    return response.status(400).json({ error: 'Username must be at least 3 characters long' })
  }

  if (password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters long' })
  }
 // if (User.findOne({username})) {
 //   return response.status(400).json({error: "username already exists"})
 // }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  console.log("saved user:",savedUser)
  response.status(201).json(savedUser)
})




usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs')

  response.json(users)
})

module.exports = usersRouter