const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');

// router.get('/', checkAuth, PostsController.get_posts);
router.get('/', PostsController.get_posts);

router.post('/', PostsController.create_post);

router.get('/:id', PostsController.get_one_post);

router.put('/:id', PostsController.update_post);

router.delete('/:id', PostsController.remove_post);

module.exports = router;