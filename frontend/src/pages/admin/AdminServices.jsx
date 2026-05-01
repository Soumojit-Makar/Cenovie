import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Briefcase } from 'lucide-react'
import { serviceAPI } from '../../services/api'
import { LoadingSpinner, EmptyState } from '../../components/ui/index.jsx'

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    serviceAPI.getAllAdmin()
      .then(r => setServices(r.data.services || []))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleToggle = async (s) => {
    try {
      await serviceAPI.update(s._id, { isPublished: !s.isPublished })
      toast.success(s.isPublished ? 'Service hidden' : 'Service published')
      load()
    } catch { toast.error('Update failed') }
  }

  return (
    <>
      <Helmet><title>Services — Cenovie Admin</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-slate-900 text-2xl">Services</h1>
          <p className="text-slate-500 text-sm mt-1">Manage service visibility. Content is managed via the seed/database.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? <LoadingSpinner light /> : services.length === 0 ? (
            <EmptyState icon={Briefcase} title="No services found" description="Run npm run seed to populate services." />
          ) : (
            <div className="divide-y divide-slate-100">
              {services.map(s => (
                <div key={s._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 font-medium text-sm truncate">{s.title}</p>
                    <p className="text-slate-500 text-xs truncate mt-0.5">{s.summary}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`badge text-xs ${s.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-500'}`}>
                      {s.isPublished ? 'Live' : 'Hidden'}
                    </span>
                    <button onClick={() => handleToggle(s)}
                      className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-all"
                    >
                      {s.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
          <p className="text-sm text-brand-600">
            💡 Service content (descriptions, features, benefits) is managed directly in the database. To update service content, use the API or update the seed file and re-seed.
          </p>
        </div>
      </div>
    </>
  )
}
