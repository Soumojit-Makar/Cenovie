const express = require('express');
const router  = express.Router();
const {
  getJobs, getJob, applyToJob,
  createJob, updateJob, deleteJob, getApplications, updateApplicationStatus
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.get('/admin/applications', protect, getApplications);
router.put('/admin/applications/:id/status', protect, updateApplicationStatus);
router.get('/',        getJobs);
router.get('/:slug',   getJob);
// Resume is uploaded by the frontend directly to Cloudinary.
// The resulting URL arrives as req.body.resumeUrl (plain JSON).
router.post('/:id/apply', applyToJob);
router.post('/',           protect, createJob);
router.put('/:id',         protect, updateJob);
router.delete('/:id',      protect, deleteJob);

module.exports = router;
