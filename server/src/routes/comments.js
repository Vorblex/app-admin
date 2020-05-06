const express = require('express');
const router = express.Router();
const CommentsController = require('../controllers/comments');

// router.get('/', CommentsController.get_comments);

router.post('/:id/create', CommentsController.create_comment);

// router.get('/', PostsController.get_posts);

// router.post('/signin', UsersController.user_login);

// router.get('/:id', PostsController.get_one_post);

// router.put('/:id', PostsController.update_post);

// router.delete('/:id', UsersController.remove_user);

module.exports = router;