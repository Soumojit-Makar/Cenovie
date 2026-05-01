const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  summary: { type: String, required: true },
  description: { type: String },
  icon: { type: String }, // icon name string (Lucide or custom)
  heroImage: { type: String },
  businessProblem: { type: String },
  solutionOffered: { type: String },
  features: [String],
  industries: [String],
  benefits: [String],
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
