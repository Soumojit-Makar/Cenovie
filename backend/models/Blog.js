const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  excerpt: { type: String, required: true },
  content: { type: String },
  coverImage: { type: String },
  tags: [String],
  category: {
  type: String,
  enum: [
    // existing
    'gis-technology',
    'remote-sensing',
    'smart-city',
    'land-intelligence',
    'geo-ai',
    'field-survey',
    'industry-insights',
    'company-news',

    // ADD THESE (for your seed)
    'software-engineering',
    'cloud-devops',
    'ai-ml',
    'digital-transformation'
  ],
  default: 'software-engineering'
},
  author: {
    name: { type: String, default: 'Cenovie Team' },
    avatar: String,
    bio: String
  },
  readTime: { type: Number, default: 5 }, // minutes
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  publishedAt: Date
}, { timestamps: true });

// Set publishedAt on publish
blogSchema.pre('save', function (next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
