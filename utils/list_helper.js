const { listen } = require("../app")

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const sum = blogs.reduce(
        (accumulator, currentValue) => accumulator + currentValue.likes,
        0
      )
    console.log(sum)
    return sum
}
  
const favoriteBlog = (blogs) => {
    const result = blogs.reduce((accumulator, currentValue) => {
      if (currentValue.likes > accumulator.likes) {
        return currentValue;
      } else {
        return accumulator;
      }
    }, blogs[0]);
    return JSON.stringify({
        title : result.title,
        author : result.author,
        likes : result.likes
    })
}
  
module.exports = {
    dummy, totalLikes, favoriteBlog
}