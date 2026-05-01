const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },

  department: {
    type: String,
    enum: [
      'engineering',
      'ai-data',
      'devops',
      'design',
      'gis-technology',
      'remote-sensing',
      'software-engineering',
      'data-engineering',
      'project-management',
      'business-development',
      'hr-operations'
    ],
    required: true
  },

  location: { type: String, default: 'Kolkata, India' },

  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },

  experience: { type: String },
  description: { type: String },
  responsibilities: [String],
  requirements: [String],
  niceToHave: [String],
  salary: { type: String },
  isOpen: { type: Boolean, default: true },
  closingDate: Date
}, { timestamps: true });

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String },
  resumeUrl: { type: String, required: true },
  coverLetter: { type: String },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: { type: String },

  status: {
    type: String,
    enum: ['received', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'],
    default: 'received'
  },

  notes: String
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
const Application = mongoose.model('Application', applicationSchema);

module.exports = { Job, Application };