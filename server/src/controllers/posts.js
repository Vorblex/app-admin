const Post = require('../models/post');

exports.get_posts = (req, res) => {
    console.log(req.userData);
    Post.find({}, 'title description action', (err, posts) => {
      console.log(posts);
        if (err) {
            res.sendStatus(500)
        }
         else {
          // const user = req.userData
          // user.credentials = 'regular'
          // if(user.role === 'admin') {
          //   user.credentials = 'top'
          // }

            res.status('200').send({posts})
        }
        }).sort({ _id: -1 })
};

exports.get_one_post = (req, res) => {
    Post.findById(req.params.id, 'title description action', (err, post) => {
        if(err) {
            res.sendStatus(500)
        } else {
            res.send(post)
        }
      })
};

exports.create_post = (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        action: req.body.action
      })
      post.save((err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.status('201')
                .send({
                    success: true,
                    message: `Post with ID_${data._id} saved successfully!`
                })
        }
      })
};

exports.update_post = (req, res) => {
    Post.findById(req.params.id, 'title desctiption action', (err, post) => {
        if(err) {
          console.log(err);
        } else {
          if(req.body.title) {
            post.title = req.body.title
          }
          if(req.body.description) {
            post.description = req.body.description
          }
          if(req.body.action) {
            post.action = req.body.action
          }
          post.save((err, data) => {
            if(err) {
              res.sendStatus(500)
            } else {
              res.send({
                success: true,
                message: `Post with ID_${data._id} saved updated!` 
              })
            }
          })
        }
    })
};

exports.remove_post = (req, res) => {
    Post.remove({_id: req.params.id}, err => {
        if(err) {
          res.sendStatus(500)
        } else {
          res.sendStatus(200)
        }
      })
};