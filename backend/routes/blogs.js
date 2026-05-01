const express = require('express');
const router = express.Router();
const {
  getBlogs, getBlog, createBlog,
  updateBlog, deleteBlog, getAllBlogsAdmin
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

router.get('/admin/all', protect, getAllBlogsAdmin);
router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
