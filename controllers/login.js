const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {

  const { username, password } = request.body
//  console.log("checking login details of ...",username,password)
  const user = await User.findOne({ username })
  console.log(user)
 // console.log('user:',user)
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
  //  console.log("incorrect details")
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
 // console.log('generating token ...')
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  console.log(user.name)
  response
    .status(200)
    .send({ token, username: user.username, realname: user.realname })
})

module.exports = loginRouter