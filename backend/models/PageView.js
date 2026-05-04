const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  page: { type: String, required: true },       // e.g. "/insights/my-blog-slug"
  referer: { type: String, default: '' },        // where they came from
  userAgent: { type: String, default: '' },
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop'],
    default: 'desktop'
  },
  country: { type: String, default: '' },        // optional / future use
}, { timestamps: true });

// TTL index — auto-delete records older than 90 days
pageViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
pageViewSchema.index({ page: 1 });

module.exports = mongoose.model('PageView', pageViewSchema);
