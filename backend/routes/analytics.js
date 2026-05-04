const express = require('express');
const router = express.Router();
const { trackPageView, getStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.post('/pageview', trackPageView);          // Public — called by frontend
router.get('/stats', protect, getStats);          // Admin only

module.exports = router;
