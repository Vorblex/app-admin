const Sequelize = require('sequelize')
const Role = require('./role')
const db = require('../../config/db')

const Project = db.define('project', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    link: {
      type: Sequelize.STRING,
      allowNull: false
    },
    unread: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
});

Project.belongsToMany(Role, {through: 'RoleProject'})
Role.belongsToMany(Project, {through: 'RoleProject'})


module.exports = Project


