import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye, EyeOff, FolderKanban } from 'lucide-react'
import { projectAPI } from '../../services/api'
import { LoadingSpinner, EmptyState } from '../../components/ui/index.jsx'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    projectAPI.getAllAdmin()
      .then(r => setProjects(r.data.projects || []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await projectAPI.delete(id)
      toast.success('Project deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  const handleToggle = async (p) => {
    try {
      await projectAPI.update(p._id, { isPublished: !p.isPublished })
      toast.success(p.isPublished ? 'Project unpublished' : 'Project published')
      load()
    } catch { toast.error('Update failed') }
  }

  return (
    <>
      <Helmet><title>Projects — Cenovie Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-slate-900 text-2xl">Projects</h1>
            <p className="text-slate-500 text-sm mt-1">{projects.length} total projects</p>
          </div>
          <Link to="/admin/projects/new" className="btn-primary text-sm py-2.5">
            <Plus className="w-4 h-4" /> New Project
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? <LoadingSpinner light /> : projects.length === 0 ? (
            <EmptyState icon={FolderKanban} title="No projects yet"
              action={<Link to="/admin/projects/new" className="btn-primary text-sm">Add Project</Link>}
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.map(p => (
                <div key={p._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    {p.heroImage
                      ? <img src={p.heroImage} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">IMG</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-slate-900 font-medium text-sm truncate">{p.title}</p>
                      <span className={`badge text-xs ${p.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-500'}`}>
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {p.isFeatured && <span className="badge bg-amber-500/10 text-amber-400 text-xs">Featured</span>}
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5 capitalize">{p.category?.replace(/-/g, ' ')} · {p.industry?.replace(/-/g, ' ')} · {p.year}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => handleToggle(p)}
                      className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-all" title={p.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {p.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Link to={`/admin/projects/edit/${p._id}`}
                      className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-brand-600 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p._id, p.title)}
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
