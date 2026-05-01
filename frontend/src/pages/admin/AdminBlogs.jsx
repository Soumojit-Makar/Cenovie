import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText } from 'lucide-react'
import { blogAPI } from '../../services/api'
import { LoadingSpinner, EmptyState } from '../../components/ui/index.jsx'

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    blogAPI.getAllAdmin()
      .then(r => setBlogs(r.data.blogs || []))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await blogAPI.delete(id)
      toast.success('Blog deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  const handleToggle = async (b) => {
    try {
      await blogAPI.update(b._id, { isPublished: !b.isPublished })
      toast.success(b.isPublished ? 'Blog unpublished' : 'Blog published')
      load()
    } catch { toast.error('Update failed') }
  }

  return (
    <>
      <Helmet><title>Blog Posts — Cenovie Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-slate-900 text-2xl">Blog / Insights</h1>
            <p className="text-slate-500 text-sm mt-1">{blogs.length} articles</p>
          </div>
          <Link to="/admin/blogs/new" className="btn-primary text-sm py-2.5">
            <Plus className="w-4 h-4" /> New Article
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? <LoadingSpinner light /> : blogs.length === 0 ? (
            <EmptyState icon={FileText} title="No blog posts yet"
              action={<Link to="/admin/blogs/new" className="btn-primary text-sm">Write Article</Link>}
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {blogs.map(b => (
                <div key={b._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-9 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    {b.coverImage
                      ? <img src={b.coverImage} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">IMG</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-slate-900 font-medium text-sm truncate">{b.title}</p>
                      <span className={`badge text-xs ${b.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-500'}`}>
                        {b.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {b.isFeatured && <span className="badge bg-amber-500/10 text-amber-400 text-xs">Featured</span>}
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 capitalize">
                      {b.category?.replace(/-/g, ' ')} · {b.author?.name} · {b.readTime} min
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleToggle(b)}
                      className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-all"
                    >
                      {b.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Link to={`/admin/blogs/edit/${b._id}`}
                      className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-brand-600 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(b._id, b.title)}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
