const express = require('express');
const router = express.Router();
const FilesController = require('../controllers/files');


router.put('/', FilesController.save_files);

router.delete('/:id', FilesController.remove_file);


// router.get('/', PostsController.get_posts);

// router.post('/signin', UsersController.user_login);

// router.get('/:id', PostsController.get_one_post);

// router.put('/:id', PostsController.update_post);

// router.delete('/:id', UsersController.remove_user);

module.exports = router;