const Sequelize = require('sequelize');
const config = require('./index');
module.exports = new Sequelize(config.dbURL);