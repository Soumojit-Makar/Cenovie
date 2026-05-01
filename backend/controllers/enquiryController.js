const Enquiry = require('../models/Enquiry');
const { analyzeEnquiry } = require('../utils/aiAnalysis');
const { sendEnquiryToAdmin, sendEnquiryAcknowledgement } = require('../utils/email');

// POST /api/enquiries — Public
exports.submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, company, subject, message, serviceInterest } = req.body;

    const enquiry = await Enquiry.create({ name, email, phone, company, subject, message, serviceInterest });

    // Run AI analysis (non-blocking)
    let aiInsights = null;
    try {
      aiInsights = await analyzeEnquiry(enquiry);
      if (aiInsights) {
        enquiry.aiInsights = aiInsights;
        await enquiry.save();
      }
    } catch (aiError) {
      console.error('AI analysis failed (non-critical):', aiError.message);
    }

    // Send emails (non-blocking)
    try {
      await Promise.all([
        sendEnquiryToAdmin(enquiry, aiInsights),
        sendEnquiryAcknowledgement(enquiry, aiInsights?.suggestedReply)
      ]);
    } catch (emailError) {
      console.error('Email send failed (non-critical):', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. We will respond within 1–2 business days.',
      enquiryId: enquiry._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/enquiries — Admin
exports.getEnquiries = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.leadStatus = status;
    if (priority) filter['aiInsights.priority'] = priority;

    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Enquiry.countDocuments(filter);

    res.json({ success: true, enquiries, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/enquiries/:id — Admin
exports.getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

    // Mark as read
    if (!enquiry.isRead) {
      enquiry.isRead = true;
      await enquiry.save();
    }

    res.json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/enquiries/:id — Admin
exports.updateEnquiry = async (req, res) => {
  try {
    const { leadStatus, notes } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { leadStatus, notes },
      { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/enquiries/stats — Admin
exports.getStats = async (req, res) => {
  try {
    const [total, newCount, hotLeads, stats] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ leadStatus: 'new' }),
      Enquiry.countDocuments({ 'aiInsights.priority': 'hot' }),
      Enquiry.aggregate([
        { $group: { _id: '$leadStatus', count: { $sum: 1 } } }
      ])
    ]);

    res.json({ success: true, total, newCount, hotLeads, byStatus: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
