const express = require('express');
const router = express.Router();
const ProjectsController = require('../controllers/projects');
// const checkAuth = require('../middleware/auth');

router.get('/', ProjectsController.get_projects);

// router.get('/users/:name', ProjectsController.get_project_users);

router.post('/', ProjectsController.create_project);

// router.get('/:id', ProjectsController.get_one_project);

router.put('/:id', ProjectsController.update_project);

router.delete('/:id', ProjectsController.remove_project);

module.exports = router;