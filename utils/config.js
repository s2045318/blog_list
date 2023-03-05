require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'developement' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
console.log(MONGODB_URI)
module.exports = {
  MONGODB_URI,
  PORT
}