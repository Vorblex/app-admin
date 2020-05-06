const Sequelize = require('sequelize');
const db = require('../../config/db');

const Role = db.define('role', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Role
