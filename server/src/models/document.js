const Sequelize = require('sequelize')
const Project = require('./project')
const User = require('./user')
const db = require('../../config/db')

const Document = db.define('document', {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  approved: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
  ,
  viewed: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

Project.hasMany(Document)
Document.belongsTo(Project)

User.belongsToMany(Document, {through: 'DocumentUser'})
Document.belongsToMany(User, {through: 'DocumentUser'})

module.exports = Document
