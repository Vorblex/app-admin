const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Project = require('../models/project');
const Role = require('../models/role');

exports.get_projects = (req, res) => {

    // console.log(req.userData);
    Project.findAndCountAll({
      include: [{
        model: Role,
        attributes: ['name']
      }]
    })
    .then( ({rows, count}) => {

      const data = rows.map(row => {
        const mapped = row.roles.map(role => {
          return role.dataValues.name
        });

        let newRow = row.toJSON()
        newRow.roles = mapped
        return newRow

      })

      res.send({data, total: count})
    })
};

exports.create_project = async (req, res) => {
  const projectData = {
    name: req.body.name,
    link: req.body.link
  }

  // Role.create({ name: 'admin'})
  // Role.create({ name: 'teamlead'})
  // Role.create({ name: 'manager'})

  const project = await Project.create(projectData)
  const roles = await getRolesFromDB(req.body.roles)

  await project.setRoles(roles)

  const data = {
    success: true,
    message: `Project with ID${project.id} saved successfully!`
  }

  res.status('201').send(data)
};

exports.update_project = (req, res) => {
  const { name, link, roles } = req.body

  Project.findOne( { where: {id: req.params.id} })
  .then(project => project.update({ name, link }))
  .then(project => getRolesFromDB(roles).then(roles => project.setRoles(roles)))
  .then( ({id}) => {
    res.status('201')
    .send({ success: true, message: `Project with ID${id} updated successfully!` })
  })
  .catch(() => res.sendStatus(500))
};

//////////
// Project.findOne( { where: {id: req.params.id} })
// .then(p => {
//   project = p
//   return p.update({ name, link })
// })
// .then(project => ({project, roles: getRolesFromDB(req.body.roles)}) )
// .then(({roles, project}) => roles.then(roles => project.setRoles(roles)))
// .then( ({id}) => {
//   res.status('201')
//     .send({
//       success: true,
//       message: `Project with ID${id} updated successfully!`
//     })
// })
// .catch(() => res.sendStatus(500))
//////////

  // Project.findOne( { where: {id: req.params.id} })
  // .then(p => {
  //   project = p
  //   return p.update({ name, link })
  // })
  // .then(() => getRolesFromDB(req.body.roles))
  // .then(roles => project.setRoles(roles))
  // .then( ({id}) => {
  //   res.status('201')
  //   .send({ success: true, message: `Project with ID${id} updated successfully!` })
  // })
  // .catch(() => res.sendStatus(500))
///////////////////////////////
// exports.update_project = (req, res) => {
//   Project.findOne( { where: {id: req.params.id} })
//   .then(project => {
//     project.update({
//       name: req.body.name,
//       link: req.body.link
//     })
//     .then( () => {
//       getRolesFromDB(req.body.roles)
//       .then(roles => project.setRoles(roles))
//       // .then(() => project.reload())
//       .then(project => {
//         res.status('201')
//           .send({
//             success: true,
//             message: `Project with ID${project.id} updated successfully!`
//           })
//       })
//     })
//   })
//   .catch(() => res.sendStatus(500))
// };

exports.remove_project = (req, res) => {
  Project.destroy({ where: {id: req.params.id} })
  .then(() =>  res.sendStatus(200))
  .catch(() => res.sendStatus(500))
};

function getRolesFromDB(roles) {
  return Role.findAll(
    {
      where: {
        name: {[Op.in]: roles}
      },
      attributes: ['id']
    })
}

//////////////////////

// exports.get_one_project = (req, res) => {
//   Project.findById(req.params.id, 'name link', (err, project) => {
//       if(err) {
//           res.sendStatus(500)
//       } else {
//           res.send(project)
//       }
//     })
// };

exports.get_project_users = (req, res) => {
  console.log(req.params);
  User.find({accessTo: req.params.name}, 'email role', (err, users) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.status(200).send({users})
    }
  }).sort({_id: -1});
};

// exports.create_project = (req, res) => {
//     const project = new Project({
//         name: req.body.name,
//         link: req.body.link
//       })
//       project.save((err, data) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.status('201')
//                 .send({
//                     success: true,
//                     message: `Project with ID_${data._id} saved successfully!`
//                 })
//         }
//       })
// };

// exports.update_project = (req, res) => {
//     Project.findById(req.params.id, 'name link', (err, project) => {
//         if(err) {
//           console.log(err);
//         } else {
//           if(req.body.name) {
//             project.name = req.body.name
//           }
//           if(req.body.link) {
//             project.link = req.body.link
//           }
//           project.save((err, data) => {
//             if(err) {
//               res.sendStatus(500)
//             } else {
//               res.send({
//                 success: true,
//                 message: `Project with ID_${data._id} saved updated!` 
//               })
//             }
//           })
//         }
//     })
// };

// exports.remove_project = (req, res) => {
//     Project.remove({_id: req.params.id}, err => {
//         if(err) {
//           res.sendStatus(500)
//         } else {
//           res.sendStatus(200)
//         }
//       })
// };