const express = require('express');
const router = express.Router();
const {
  submitEnquiry, getEnquiries, getEnquiry,
  updateEnquiry, getStats
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

// Public
router.post('/', submitEnquiry);

// Admin
router.get('/stats', protect, getStats);
router.get('/', protect, getEnquiries);
router.get('/:id', protect, getEnquiry);
router.patch('/:id', protect, updateEnquiry);

module.exports = router;
