import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { blogAPI } from '../../services/api'
import ImageUploader from '../../components/ui/ImageUploader'

const CATEGORIES = ['gis-technology','remote-sensing','smart-city','land-intelligence','geo-ai','field-survey','industry-insights','company-news']

const INIT = {
  title: '', slug: '', excerpt: '', content: '', coverImage: '',
  category: 'gis-technology', tags: '', author: '', readTime: 5,
  isPublished: false, isFeatured: false
}

export default function AdminBlogForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState(INIT)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    blogAPI.getAllAdmin().then(r => {
      const b = r.data.blogs?.find(x => x._id === id)
      if (b) setForm({
        ...b,
        tags: b.tags?.join(', ') || '',
        author: b.author?.name || '',
        content: b.content || '',
      })
    }).finally(() => setLoading(false))
  }, [id, isEdit])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        author: { name: form.author || 'Cenovie Team' },
        readTime: parseInt(form.readTime),
      }
      if (isEdit) {
        await blogAPI.update(id, payload)
        toast.success('Article updated')
      } else {
        await blogAPI.create(payload)
        toast.success('Article created')
        navigate('/admin/blogs')
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
      <Helmet><title>{isEdit ? 'Edit Article' : 'New Article'} — Admin</title></Helmet>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/blogs" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display font-bold text-slate-900 text-xl">{isEdit ? 'Edit Article' : 'New Article'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-slate-200 p-6">
          <div>
            <label className="form-label-dark">Title *</label>
            <input type="text" value={form.title} onChange={set('title')} className="form-input-dark" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label-dark">Slug</label>
              <input type="text" value={form.slug} onChange={set('slug')} className="form-input-dark" placeholder="auto-generated" />
            </div>
            <div>
              <label className="form-label-dark">Category</label>
              <select value={form.category} onChange={set('category')} className="form-input-dark">
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-white capitalize">{c.replace(/-/g,' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label-dark">Author Name</label>
              <input type="text" value={form.author} onChange={set('author')} placeholder="Cenovie Team" className="form-input-dark" />
            </div>
            <div>
              <label className="form-label-dark">Read Time (minutes)</label>
              <input type="number" value={form.readTime} onChange={set('readTime')} className="form-input-dark" min="1" max="60" />
            </div>
          </div>
          <ImageUploader
            label="Cover Image"
            currentUrl={form.coverImage}
            onUpload={({ url }) => setForm(f => ({ ...f, coverImage: url }))}
            onRemove={() => setForm(f => ({ ...f, coverImage: '' }))}
            aspectRatio="16/9"
          />
          <div>
            <label className="form-label-dark">Excerpt / Summary *</label>
            <textarea value={form.excerpt} onChange={set('excerpt')} rows={3} className="form-input-dark resize-none" required />
          </div>
          <div>
            <label className="form-label-dark">Content (HTML supported)</label>
            <textarea value={form.content} onChange={set('content')} rows={12} className="form-input-dark resize-none font-mono text-sm" placeholder="<p>Your article content here...</p>" />
          </div>
          <div>
            <label className="form-label-dark">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={set('tags')} placeholder="Software Engineering, Cloud, AI, DevOps" className="form-input-dark" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={set('isPublished')} className="w-4 h-4 accent-brand-500" />
              <span className="text-slate-700 text-sm">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} className="w-4 h-4 accent-brand-500" />
              <span className="text-slate-700 text-sm">Featured</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />{isEdit ? 'Update Article' : 'Create Article'}</>}
            </button>
            <Link to="/admin/blogs" className="btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
