const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  category: {
  type: String,
  enum: [
    'custom-software',
    'full-stack',
    'mobile-app',
    'cloud-devops',
    'ai-data',
    'saas',
    'enterprise'
  ],
  required: true
},
industry: {
  type: String,
  enum: [
    'fintech',
    'healthcare',
    'logistics',
    'manufacturing',
    'e-commerce',
    'hr-tech'
  ],
  required: true
},
  client: { type: String },
  location: { type: String },
  heroImage: { type: String },
  gallery: [String],
  technologies: [String],
  outcomes: [String],
  duration: String,
  year: Number,
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

// Auto-generate slug from title
projectSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
