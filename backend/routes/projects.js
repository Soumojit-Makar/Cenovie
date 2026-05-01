const express = require('express');
const router = express.Router();
const {
  getProjects, getProject, createProject,
  updateProject, deleteProject, getAllProjectsAdmin
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.get('/admin/all', protect, getAllProjectsAdmin);
router.get('/', getProjects);
router.get('/:slug', getProject);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
