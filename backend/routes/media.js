const express = require('express');
const router  = express.Router();
const { getSignature, deleteImage } = require('../controllers/mediaController');
const { protect } = require('../middleware/auth');

// GET  /api/media/sign       — returns signed upload params (admin only)
router.get('/sign', protect, getSignature);

// DELETE /api/media/:publicId — delete asset from Cloudinary (admin only)
router.delete('/:publicId', protect, deleteImage);

module.exports = router;
