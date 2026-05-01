import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Save,
  Loader2,
  X,
  Briefcase,
  Mail,
  Phone,
  FileText,
} from 'lucide-react'

import { jobAPI } from '../../services/api'
import { LoadingSpinner, EmptyState } from '../../components/ui/index.jsx'

const DEPARTMENTS = [
  'gis-technology',
  'remote-sensing',
  'software-engineering',
  'data-engineering',
  'project-management',
  'business-development',
  'hr-operations',
]

const TYPES = ['full-time', 'part-time', 'contract', 'internship']

const APPLICATION_STATUSES = [
  'received',
  'reviewing',
  'shortlisted',
  'interview',
  'rejected',
  'hired',
]

const INIT = {
  title: '',
  slug: '',
  department: 'gis-technology',
  location: 'Kolkata, India',
  type: 'full-time',
  experience: '',
  description: '',
  requirements: '',
  responsibilities: '',
  isOpen: true,
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(INIT)

  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingAppId, setUpdatingAppId] = useState(null)

  const load = async () => {
    setLoading(true)

    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobAPI.getAll(),
        jobAPI.getApplications(),
      ])

      setJobs(jobsRes.data.jobs || [])
      setApplications(appsRes.data.applications || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load jobs/applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const set = key => e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const createSlug = title => {
    return `${title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')}-${Date.now()}`
  }

  const handleCreate = async e => {
    e.preventDefault()

    if (!form.title.trim()) {
      toast.error('Job title is required')
      return
    }

    setSaving(true)

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: createSlug(form.title),
        requirements: form.requirements
          .split('\n')
          .map(item => item.trim())
          .filter(Boolean),
        responsibilities: form.responsibilities
          .split('\n')
          .map(item => item.trim())
          .filter(Boolean),
      }

      await jobAPI.create(payload)

      toast.success('Job created successfully')
      setShowForm(false)
      setForm(INIT)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return

    setDeletingId(id)

    try {
      await jobAPI.delete(id)
      toast.success('Job deleted')
      setJobs(prev => prev.filter(job => job._id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggle = async job => {
    setTogglingId(job._id)

    try {
      await jobAPI.update(job._id, { isOpen: !job.isOpen })

      toast.success(job.isOpen ? 'Position closed' : 'Position opened')

      setJobs(prev =>
        prev.map(item =>
          item._id === job._id ? { ...item, isOpen: !item.isOpen } : item
        )
      )
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setTogglingId(null)
    }
  }

  const handleApplicationStatus = async (id, status) => {
    setUpdatingAppId(id)

    try {
      const res = await jobAPI.updateApplicationStatus(id, { status })

      toast.success('Application status updated')

      setApplications(prev =>
        prev.map(app =>
          app._id === id
            ? { ...app, status: res.data.application?.status || status }
            : app
        )
      )
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed')
    } finally {
      setUpdatingAppId(null)
    }
  }

  const getResumeUrl = url => {
    if (!url) return '#'

    if (url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/fl_attachment/')
    }

    return url
  }

  const getStatusClass = status => {
    if (status === 'hired') return 'bg-green-500/10 text-green-500'
    if (status === 'rejected') return 'bg-red-500/10 text-red-500'
    if (status === 'interview') return 'bg-blue-500/10 text-blue-500'
    if (status === 'shortlisted') return 'bg-purple-500/10 text-purple-500'
    if (status === 'reviewing') return 'bg-yellow-500/10 text-yellow-500'
    return 'bg-slate-500/10 text-slate-500'
  }

  return (
    <>
      <Helmet>
        <title>Jobs — Cenovie Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-slate-900 text-2xl">
              Careers / Jobs
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {jobs.length} positions · {applications.length} applications
            </p>
          </div>

          <button
            onClick={() => setShowForm(prev => !prev)}
            className="btn-primary text-sm py-2.5"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                New Position
              </>
            )}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
          >
            <h2 className="font-semibold text-slate-900">New Job Position</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="form-label-dark">Job Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={set('title')}
                  className="form-input-dark"
                  placeholder="e.g. Full Stack Developer"
                  required
                />
              </div>

              <div>
                <label className="form-label-dark">Department</label>
                <select
                  value={form.department}
                  onChange={set('department')}
                  className="form-input-dark"
                >
                  {DEPARTMENTS.map(department => (
                    <option key={department} value={department}>
                      {department.replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-dark">Type</label>
                <select
                  value={form.type}
                  onChange={set('type')}
                  className="form-input-dark"
                >
                  {TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-dark">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={set('location')}
                  className="form-input-dark"
                />
              </div>

              <div>
                <label className="form-label-dark">Experience</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={set('experience')}
                  placeholder="e.g. 3–5 years"
                  className="form-input-dark"
                />
              </div>
            </div>

            <div>
              <label className="form-label-dark">Description</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                className="form-input-dark resize-none"
              />
            </div>

            <div>
              <label className="form-label-dark">Responsibilities — one per line</label>
              <textarea
                value={form.responsibilities}
                onChange={set('responsibilities')}
                rows={4}
                className="form-input-dark resize-none"
              />
            </div>

            <div>
              <label className="form-label-dark">Requirements — one per line</label>
              <textarea
                value={form.requirements}
                onChange={set('requirements')}
                rows={4}
                className="form-input-dark resize-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isOpen}
                onChange={set('isOpen')}
              />
              Position is open
            </label>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-60 text-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Position
                </>
              )}
            </button>
          </form>
        )}

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Positions
            </h2>
          </div>

          {loading ? (
            <LoadingSpinner light />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No positions yet"
              description="Add your first job opening above."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.map(job => (
                <div
                  key={job._id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-slate-900 font-medium text-sm">
                        {job.title}
                      </p>

                      <span
                        className={`badge text-xs ${
                          job.isOpen
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {job.isOpen ? 'Open' : 'Closed'}
                      </span>

                      <span className="badge bg-slate-500/10 text-slate-500 text-xs capitalize">
                        {job.type?.replace(/-/g, ' ')}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs mt-0.5 capitalize">
                      {job.department?.replace(/-/g, ' ')} · {job.location}
                      {job.experience && ` · ${job.experience}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggle(job)}
                      disabled={togglingId === job._id}
                      className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
                    >
                      {togglingId === job._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : job.isOpen ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(job._id, job.title)}
                      disabled={deletingId === job._id}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500"
                    >
                      {deletingId === job._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Job Applications
            </h2>
          </div>

          {loading ? (
            <LoadingSpinner light />
          ) : applications.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applications yet"
              description="Candidates will appear here once they apply."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map(app => (
                <div key={app._id} className="px-5 py-4 hover:bg-slate-50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <p className="text-slate-900 font-semibold">{app.name}</p>

                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {app.email}
                        </span>

                        {app.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {app.phone}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 text-sm mt-2">
                        Applied for:{' '}
                        <span className="font-medium text-slate-700">
                          {app.jobTitle || app.job?.title || 'N/A'}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      <span className={`badge text-xs w-fit ${getStatusClass(app.status)}`}>
                        {app.status
                          ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                          : 'Received'}
                      </span>

                      <select
                        value={app.status || 'received'}
                        disabled={updatingAppId === app._id}
                        onChange={e => handleApplicationStatus(app._id, e.target.value)}
                        className="form-input-dark text-xs py-1.5 min-w-[150px]"
                      >
                        {APPLICATION_STATUSES.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>

                      {updatingAppId === app._id && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Updating...
                        </span>
                      )}
                    </div>
                  </div>

                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        Cover Letter
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3">
                    {app.resumeUrl && (
                      <a
                        href={getResumeUrl(app.resumeUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        View Resume
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}