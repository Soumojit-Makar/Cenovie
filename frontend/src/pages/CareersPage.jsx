import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Briefcase, MapPin, Clock, ArrowRight, Code2, Cloud, Brain, Users } from 'lucide-react'
import { jobAPI } from '../services/api'
import { PageHero, LoadingSpinner, EmptyState, CTABanner } from '../components/ui/index.jsx'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import FileUploader from '../components/ui/FileUploader.jsx'
const perks = [
  { icon: Code2,  title: "Cutting-edge Tech Stack",    desc: "Work with the latest in cloud, AI, and full-stack engineering — no legacy shackles." },
  { icon: Cloud,  title: "Remote-friendly Culture",    desc: "Flexible hybrid model. We trust you to deliver, wherever you are." },
  { icon: Brain,  title: "Continuous Learning Budget", desc: "₹50,000/year for courses, certifications, and conferences. No approval headaches." },
  { icon: Users,  title: "Engineering Community",      desc: "Weekly tech talks, internal hackathons, and open-source contribution days." },
]

function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false)
  const [applying, setApplying] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '', resumeUrl: '' })
  const [submitting, setSubmitting] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleApply = async e => {
    e.preventDefault()
    if (!form.resumeUrl) { toast.error('Please upload your resume first'); return }
    setSubmitting(true)
    try {
      // Send plain JSON — resume is already on Cloudinary
      await jobAPI.apply(job._id, form)
      toast.success('Application submitted!')
      setApplying(false)
      setForm({ name: '', email: '', phone: '', coverLetter: '', resumeUrl: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const typeBadgeClass = {
    'full-time': 'badge-ocean', 'part-time': 'badge-teal',
    'contract': 'badge-amber', 'internship': 'badge-green'
  }[job.type] || 'badge-ocean'

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`badge ${typeBadgeClass} capitalize`}>{job.type}</span>
            <span className="badge-gray capitalize">{job.department?.replace(/-/g, ' ')}</span>
          </div>
          <h3 className="font-display font-bold text-slate-900 text-xl mb-1">{job.title}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
            {job.experience && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.experience}</span>}
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors flex-shrink-0"
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-5">
          {job.description && <p className="text-slate-600 leading-relaxed">{job.description}</p>}

          {job.responsibilities?.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Responsibilities</h4>
              <ul className="space-y-1.5">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">Requirements</h4>
              <ul className="space-y-1.5">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!applying ? (
            <button onClick={() => setApplying(true)} className="btn-primary">
              Apply for this Position
            </button>
          ) : (
            <form onSubmit={handleApply} className="mt-4 p-6 rounded-lg bg-white border border-slate-200 space-y-4">
              <h4 className="font-display font-semibold text-slate-900 text-lg">Apply for {job.title}</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input type="text" value={form.name} onChange={set('name')} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input type="email" value={form.email} onChange={set('email')} className="form-input" required />
                </div>
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input type="tel" value={form.phone} onChange={set('phone')} className="form-input" />
              </div>
              <FileUploader
                label="Resume"
                required
                currentUrl={form.resumeUrl}
                onUpload={(url) => setForm(f => ({ ...f, resumeUrl: url }))}
                onRemove={() => setForm(f => ({ ...f, resumeUrl: '' }))}
              />
              <div>
                <label className="form-label">Cover Letter</label>
                <textarea value={form.coverLetter} onChange={set('coverLetter')} rows={3} className="form-input resize-none" placeholder="Tell us why you'd be a great fit..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : 'Submit Application'}
                </button>
                <button type="button" onClick={() => setApplying(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default function CareersPage() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobAPI.getAll().then(r => setJobs(r.data.jobs || [])).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet>
        <title>Careers at Cenovie | Join Our Engineering Team</title>
        <meta name="description" content="Build world-class software at Cenovie. We're hiring engineers, architects, and product specialists who care deeply about craft and outcomes." />
      </Helmet>

      <PageHero
        label="Careers"
        title="Build the future of enterprise software"
        subtitle="Join a team of engineers who care as much about code quality as they do about business outcomes. No ego, no politics — just craft."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Careers' }]}
      />

      {/* Perks */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map(p => (
              <div key={p.title} className="card p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center mx-auto mb-4">
                  <p.icon className="w-5 h-5 text-gold-600" />
                </div>
                <h4 className="font-display font-semibold text-brand-900 text-sm mb-2">{p.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-brand-900 text-2xl mb-2">Open positions</h2>
          <p className="text-slate-500 text-sm mb-8">All roles are open to exceptional candidates — experience ranges are guidelines, not barriers.</p>
          {loading ? <LoadingSpinner /> : jobs.length === 0
            ? <EmptyState icon={Briefcase} title="No open roles right now" description="We're always looking for exceptional engineers. Send us your CV anyway." />
            : <div className="space-y-3">{jobs.filter(j => j.isOpen).map(j => <JobCard key={j._id} job={j} />)}</div>
          }
        </div>
      </section>

      <CTABanner
        title="Don't see the right role?"
        subtitle="We hire for potential and culture fit. Send your CV and tell us what you'd like to build."
        primaryLabel="Send Your CV"
        primaryTo="/contact"
      />
    </>
  )
}
