const Sequelize = require('sequelize')
const Role = require('./role')
const db = require('../../config/db')

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING
  }
});


Role.hasMany(User)
User.belongsTo(Role)
// User.sync({force: true})

module.exports = User
