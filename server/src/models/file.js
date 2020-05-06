const Sequelize = require('sequelize')
const Document = require('./document')
const db = require('../../config/db')

const File = db.define('file', {
  path: {
    type: Sequelize.STRING,
    allowNull: false
  },
  filePath: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Document.hasMany(File)
File.belongsTo(Document)

module.exports = File
