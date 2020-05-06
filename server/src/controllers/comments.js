const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Document = require('../models/document');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.get_comments = (req, res) => {
  // User.findAndCountAll({
  //     include: [{
  //       model: Role,
  //       attributes: ['name']
  //     }
  //   ]
  //   })
  //   .then( ({rows, count}) => {

  //     res.send({data: rows, total: count})
  //   })
};

exports.create_comment = async (req, res) => {
  const documentId = req.params.id
  const comment = req.body.comment

  const commentData = { comment }
  
  const commentInstance = await Comment.create(commentData)
  const document = await Document.findOne( {where: { id: documentId }} )
  const user = await User.findOne( { where: { name: 'Oleksandr Vorobey' } })

  commentInstance.setDocument(document.id)
  commentInstance.setUser(user.id)
  
  const response = {
    // user,
    // role,
    commentInstance,
    success: true,
    // message:
    // `Uesr with ID${user.id} saved successfully!`
  }

  res.status('201').send(response)
};

// exports.update_document = (req, res) => {
//   const { name, link, roles } = req.body

//   Project.findOne( { where: {id: req.params.id} })
//   .then(project => project.update({ name, link }))
//   .then(project => _getRolesFromDB(roles).then(roles => project.setRoles(roles)))
//   .then( ({id}) => {
//     res.status('201')
//     .send({ success: true, message: `Project with ID${id} updated successfully!` })
//   })
//   .catch(() => res.sendStatus(500))
// };

// exports.remove_user = (req, res) => {
//   User.destroy({ where: {id: req.params.id} })
//   .then(() =>  res.sendStatus(200))
//   .catch(() => res.sendStatus(500))
// };

// exports.set_document_viewed = (req, res) => {
//   console.log('did',req.params.id);
//   // Project.destroy({ where: {id: req.params.id} })
//   // .then(() =>  res.sendStatus(200))
//   // .catch(() => res.sendStatus(500))
// };

// function _getRolesFromDB(roles) {
//   return Role.findAll(
//     {
//       where: {
//         name: {[Op.in]: roles}
//       },
//       attributes: ['id']
//     })
// }

