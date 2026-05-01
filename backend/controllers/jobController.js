const { Job, Application } = require('../models/Job');
const { sendApplicationToAdmin, sendApplicationAcknowledgement,sendApplicationStatusUpdate } = require('../utils/email');

// GET /api/jobs — Public
exports.getJobs = async (req, res) => {
  try {
    const { department, type } = req.query;
    const filter = { isOpen: true };
    if (department) filter.department = department;
    if (type) filter.type = type;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/jobs/:slug — Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug, isOpen: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/jobs/:id/apply — Public
exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isOpen) {
      return res.status(404).json({ success: false, message: 'Job not found or closed' });
    }

    const { name, email, phone, coverLetter, resumeUrl } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'Resume URL is required. Please upload your resume first.' });
    }

    const application = await Application.create({
      name, email, phone, coverLetter, resumeUrl,
      jobId: job._id,
      jobTitle: job.title
    });

    // Send notifications (non-blocking)
    try {
      await Promise.all([
        sendApplicationToAdmin(application, job.title),
        sendApplicationAcknowledgement(application, job.title)
      ]);
    } catch (emailError) {
      console.error('Email error (non-critical):', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. We will be in touch shortly.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/jobs — Admin
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/jobs/:id — Admin
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/jobs/:id — Admin
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/jobs/admin/applications — Admin
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title department')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// PUT /api/jobs/admin/applications/:id/status — Admin
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['received', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    
    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    Promise.all([
      sendApplicationStatusUpdate(application, application.jobTitle, status)

    ]).catch(emailError => {
      console.error('Email error (non-critical):', emailError.message);
    });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
