import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { projectAPI } from '../../services/api'
import ImageUploader from '../../components/ui/ImageUploader'

const CATEGORIES = ['web-gis','mobile-gis','remote-sensing','data-engineering','land-information','urban-planning','utility-mapping','survey-digitization','geo-ai','consulting','full-stack-development','enterprise-web-solutions','mobile-app-development','cloud-devops-solutions','ai-data-solutions']
const INDUSTRIES = ['urban-planning','engineering','agriculture','environment','utilities','transportation','land-property','disaster-management','government','mining','e-commerce-handicrafts','e-commerce ','food-delivery-subscription','education / edTech','education']

const INIT = {
  title: '', slug: '', shortDescription: '', fullDescription: '', category: '',
  industry: '', client: '', location: '', heroImage: '', technologies: '',
  outcomes: '', duration: '', year: new Date().getFullYear(), isPublished: false, isFeatured: false
}

export default function AdminProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    // Find the project by id from admin list
    projectAPI.getAllAdmin().then(r => {
      const p = r.data.projects?.find(x => x._id === id)
      if (p) {
        setForm({
          ...p,
          technologies: p.technologies?.join(', ') || '',
          outcomes: p.outcomes?.join('\n') || '',
        })
      }
    }).finally(() => setLoading(false))
  }, [id, isEdit])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        outcomes: form.outcomes.split('\n').map(o => o.trim()).filter(Boolean),
        year: parseInt(form.year),
      }
      if (isEdit) {
        await projectAPI.update(id, payload)
        toast.success('Project updated')
      } else {
        await projectAPI.create(payload)
        toast.success('Project created')
        navigate('/admin/projects')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-12 text-center text-slate-500">Loading…</div>

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Project' : 'New Project'} — Admin</title></Helmet>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/projects" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display font-bold text-slate-900 text-xl">{isEdit ? 'Edit Project' : 'New Project'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-slate-200 p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="form-label-dark">Title *</label>
              <input type="text" value={form.title} onChange={set('title')} className="form-input-dark" required />
            </div>
            <div>
              <label className="form-label-dark">Slug</label>
              <input type="text" value={form.slug} onChange={set('slug')} className="form-input-dark" placeholder="auto-generated if blank" />
            </div>
            <div>
              <label className="form-label-dark">Year</label>
              <input type="number" value={form.year} onChange={set('year')} className="form-input-dark" min="2000" max="2030" />
            </div>
            <div>
              <label className="form-label-dark">Category *</label>
              <select value={form.category} onChange={set('category')} className="form-input-dark" required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-white capitalize">{c.replace(/-/g,' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label-dark">Industry *</label>
              <select value={form.industry} onChange={set('industry')} className="form-input-dark" required>
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i} className="bg-white capitalize">{i.replace(/-/g,' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label-dark">Client</label>
              <input type="text" value={form.client} onChange={set('client')} className="form-input-dark" />
            </div>
            <div>
              <label className="form-label-dark">Location</label>
              <input type="text" value={form.location} onChange={set('location')} className="form-input-dark" />
            </div>
            <div>
              <label className="form-label-dark">Duration</label>
              <input type="text" value={form.duration} onChange={set('duration')} placeholder="e.g. 12 months" className="form-input-dark" />
            </div>
            <div className="sm:col-span-2">
              <ImageUploader
                label="Hero Image"
                currentUrl={form.heroImage}
                onUpload={({ url }) => setForm(f => ({ ...f, heroImage: url }))}
                onRemove={() => setForm(f => ({ ...f, heroImage: '' }))}
                aspectRatio="16/7"
              />
            </div>
          </div>

          <div>
            <label className="form-label-dark">Short Description *</label>
            <textarea value={form.shortDescription} onChange={set('shortDescription')} rows={2} className="form-input-dark resize-none" required />
          </div>
          <div>
            <label className="form-label-dark">Full Description</label>
            <textarea value={form.fullDescription} onChange={set('fullDescription')} rows={5} className="form-input-dark resize-none" />
          </div>
          <div>
            <label className="form-label-dark">Technologies (comma separated)</label>
            <input type="text" value={form.technologies} onChange={set('technologies')} placeholder="ArcGIS, PostGIS, React, Python" className="form-input-dark" />
          </div>
          <div>
            <label className="form-label-dark">Outcomes (one per line)</label>
            <textarea value={form.outcomes} onChange={set('outcomes')} rows={4} className="form-input-dark resize-none" placeholder="Reduced survey time by 40%&#10;Mapped 2,400 km of network" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={set('isPublished')} className="w-4 h-4 accent-brand-500" />
              <span className="text-slate-700 text-sm">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} className="w-4 h-4 accent-brand-500" />
              <span className="text-slate-700 text-sm">Featured on homepage</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />{isEdit ? 'Update Project' : 'Create Project'}</>}
            </button>
            <Link to="/admin/projects" className="btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
