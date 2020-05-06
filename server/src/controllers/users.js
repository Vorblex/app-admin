const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Role = require('../models/role');
const User = require('../models/user');
const bCrypt = require('bcrypt-node')

exports.get_users = (req, res) => {
  User.findAndCountAll({
      include: [{
        model: Role,
        attributes: ['name']
      }
    ]
    })
    .then( ({rows, count}) => {

      res.send({data: rows, total: count})
    })
};

exports.create_user = async (req, res) => {

  const password = bCrypt.hashSync("q");

  const documentData = {
    name: req.body.name,
    email: req.body.email,
    password
  }
  const user = await User.create(documentData)
  const role = await Role.findOne( { where: { name: req.body.roles } })
  
  await user.setRole(role.id)

  const response = {
    user,
    role,
    success: true, message:
    `User with ID${user.id} saved successfully!`
  }

  res.status('201').send(response)
};

exports.update_user = (req, res) => {
  const { name, roles } = req.body

  User.findOne( { where: {id: req.params.id} })
  .then(user => user.update({ name, email }))
  .then(user => _getRolesFromDB(roles).then(roles => user.setRoles(roles)))
  .then( ({id}) => {
    res.status('201')
    .send({ success: true, message: `User with ID${name} updated successfully!` })
  })
  .catch(() => res.sendStatus(500))
};

exports.remove_user = (req, res) => {
  User.destroy({ where: {id: req.params.id} })
  .then(() =>  res.sendStatus(200))
  .catch(() => res.sendStatus(500))
};

function _getRolesFromDB(roles) {
  return Role.findAll(
    {
      where: {
        name: {[Op.in]: roles}
      },
      attributes: ['id']
    })
}

