const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const existingUser = await User.findOne({ username: request.body.username })
  console.log(existingUser)
  if (! (request.body.password.length >= 3 & request.body.username.length > 3)){
     response.status(400)
      .json({ error: 'User validation failed: password and username: Must be at least 3 characters' })  
    }
  else if (existingUser) {
    response.status(400)
      .json({error: 'User validation failed: username is already taken'})
  } else {
      const { username, personName, password } = request.body
  
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
  
      const user = new User({
        username,
        personName,
        passwordHash
      })
  
      const savedUser = await user.save()
      response.status(201).json(savedUser)    
    }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
  response.json(users)
})

module.exports = usersRouter