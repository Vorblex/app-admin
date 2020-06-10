const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');

router.get('/', UsersController.get_users);

router.get('/permissions', UsersController.get_user_permissions);

router.post('/', UsersController.create_user);

// router.get('/', PostsController.get_posts);

// router.post('/signin', UsersController.user_login);

// router.get('/:id', PostsController.get_one_post);

router.put('/:id', UsersController.update_user);

router.delete('/:id', UsersController.remove_user);


module.exports = router;