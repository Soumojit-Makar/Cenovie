const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  serviceInterest: { type: String },
  leadStatus: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'closed-won', 'closed-lost'],
    default: 'new'
  },
  // AI-powered insights
  aiInsights: {
    intent: String,
    recommendedService: String,
    priority: { type: String, enum: ['hot', 'warm', 'cold'] },
    summary: String,
    suggestedReply: String,
    processedAt: Date
  },
  notes: String,
  source: { type: String, default: 'website' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
