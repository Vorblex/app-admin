const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Project = require('../models/project');
const Document = require('../models/document');
const File = require('../models/file');
const Comment = require('../models/comment');
const User = require('../models/user');

exports.get_documents = async (req, res) => {
  const {rows, count} = await Document.findAndCountAll({
      where: {
        projectId: req.query.project_id
      },
      include: [{
        model: User
      },
      {
        model: File
      },
      {
        model: Comment,
        attributes: ['comment', 'createdAt']
      }]
    })
    // var u = {}
    // u = await rows[0].getUsers({ attributes: ['name'], joinTableAttributes: ['documentId']})
    const data = rows.map(row => {

        const filtered = row.users.filter(user => {
          return user.id = req.user.id
        });

        let newRow = row.toJSON()
        filtered.length && (newRow.viewed = 1)
        delete newRow.users 
        return newRow
      })

      res.send({data, total: count})
};

exports.create_document = async (req, res) => {
  const documentData = {
    projectId: req.body.project_id,
    description: req.body.description
  }

  const document = await Document.create(documentData)
  // const roles = await _getRolesFromDB(req.body.roles)

  // await document.setRoles(roles)

  const response = {
    success: true, message:
    `Document with ID${document.id} saved successfully!`
  }

  res.status('201').send(response)
};

exports.update_document = (req, res) => {
  const { description } = req.body

  Document.findOne( { where: {id: req.params.id} })
  .then(document => document.update({ description }))
  .then( ({id}) => {
    res.status('201')
    .send({ success: true, message: `Document with ID${id} updated successfully!` })
  })
  .catch((e) => console.log(e)
  )
};

exports.remove_document = (req, res) => {
  Document.destroy({ where: {id: req.params.id} })
  .then(() =>  res.sendStatus(200))
  .catch(() => res.sendStatus(500))
};

exports.set_document_viewed =  async (req, res) => {
  try {
    const document = await Document.findOne( { where: {id: req.params.id} })
    const user = await User.findOne( { where: {name: 'Oleksandr Vorobey'} })
    const nd = await document.addUser(user)
  } catch(e) {
    console.error(e);
  }
};

exports.set_document_approved = async (req, res) => {
  const { id, approved } = req.body

  try {
    const document = await Document.findOne( { where: {id} } )
    await document.update({ approved: approved ? 1 : 0 })
    res.sendStatus('201')
  } catch(e) {
    console.erorr(e);
    res.sendStatus(500)
  }
}

function _getRolesFromDB(roles) {
  return Role.findAll(
    {
      where: {
        name: {[Op.in]: roles}
      },
      attributes: ['id']
    })
}

