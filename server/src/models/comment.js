const Sequelize = require('sequelize')
const User = require('./user')
const Document = require('./document')
const db = require('../../config/db')

const Comment = db.define('comment', {
  comment: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Document.hasMany(Comment)
Comment.belongsTo(Document)
User.hasMany(Comment)
Comment.belongsTo(User)

module.exports = Comment
