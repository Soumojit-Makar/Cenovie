// routes/services.js
const express = require('express');
const router = express.Router();
const {
  getServices, getService, createService,
  updateService, deleteService, getAllServicesAdmin
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.get('/admin/all', protect, getAllServicesAdmin);
router.get('/', getServices);
router.get('/:slug', getService);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
