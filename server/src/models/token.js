const Sequelize = require('sequelize')
// const User = require('./user')
const db = require('../../config/db')

const Token = db.define('token', {
  tokenId: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.INTEGER
  }
});

// Role.hasMany(User)
// User.belongsTo(Role)
// Token.sync({force: true})
module.exports = Token
