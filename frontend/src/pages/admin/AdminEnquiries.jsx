import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Flame, Thermometer, Snowflake, MessageSquare, Search, Filter } from 'lucide-react'
import { enquiryAPI } from '../../services/api'
import { LoadingSpinner, EmptyState } from '../../components/ui/index.jsx'

const statusColors = {
  new: 'bg-brand-50 text-brand-600',
  contacted: 'bg-blue-500/10 text-blue-600',
  qualified: 'bg-accent-50 text-accent-600',
  proposal: 'bg-amber-500/10 text-amber-400',
  'closed-won': 'bg-green-500/10 text-green-400',
  'closed-lost': 'bg-red-500/10 text-red-400',
}
const priorityIcon = { hot: Flame, warm: Thermometer, cold: Snowflake }
const priorityStyle = {
  hot: 'text-red-400',
  warm: 'text-amber-400',
  cold: 'text-slate-500',
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = { limit: 50 }
    if (statusFilter) params.status = statusFilter
    enquiryAPI.getAll(params)
      .then(r => setEnquiries(r.data.enquiries || []))
      .finally(() => setLoading(false))
  }, [statusFilter])

  const filtered = enquiries.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Helmet><title>Enquiries — Cenovie Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-slate-900 text-2xl">Enquiries</h1>
            <p className="text-slate-500 text-sm mt-1">{enquiries.length} total enquiries</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, subject…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-brand-400"
          >
            <option value="">All Statuses</option>
            {['new','contacted','qualified','proposal','closed-won','closed-lost'].map(s => (
              <option key={s} value={s} className="bg-white capitalize">{s.replace(/-/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <LoadingSpinner light />
          ) : filtered.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No enquiries found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    {['Name', 'Subject', 'Service', 'Priority', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(e => {
                    const P = priorityIcon[e.aiInsights?.priority] || Thermometer
                    return (
                      <tr key={e._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {!e.isRead && <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />}
                            <div>
                              <p className="text-slate-900 font-medium">{e.name}</p>
                              <p className="text-slate-500 text-xs">{e.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 max-w-[200px] truncate">{e.subject}</td>
                        <td className="px-4 py-3.5 text-slate-500 text-xs max-w-[120px] truncate">{e.serviceInterest || '—'}</td>
                        <td className="px-4 py-3.5">
                          <div className={`flex items-center gap-1.5 ${priorityStyle[e.aiInsights?.priority] || 'text-slate-500'}`}>
                            <P className="w-3.5 h-3.5" />
                            <span className="text-xs capitalize">{e.aiInsights?.priority || '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`badge text-xs capitalize ${statusColors[e.leadStatus] || 'bg-slate-500/10 text-slate-500'}`}>
                            {e.leadStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(e.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3.5">
                          <Link to={`/admin/enquiries/${e._id}`}
                            className="text-brand-600 hover:text-brand-600 text-xs font-medium transition-colors"
                          >View →</Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
