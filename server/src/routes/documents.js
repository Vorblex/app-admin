const express = require('express');
const router = express.Router();
const DocumentsController = require('../controllers/documents');
// const checkAuth = require('../middleware/check-auth');

// router.get('/', checkAuth, PostsController.get_posts);
// router.get('/', PostsController.get_posts);

router.get('/', DocumentsController.get_documents);

router.post('/', DocumentsController.create_document);

router.post('/:id/viewed', DocumentsController.set_document_viewed);

router.post('/approve', DocumentsController.set_document_approved);

router.put('/:id', DocumentsController.update_document);

router.delete('/:id', DocumentsController.remove_document);

module.exports = router;