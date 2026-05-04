import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MessageSquare, FolderKanban, Briefcase, FileText, Users, TrendingUp, Flame, Thermometer, Snowflake, ArrowRight, Clock } from 'lucide-react'
import { enquiryAPI, projectAPI, blogAPI, jobAPI, analyticsAPI } from '../../services/api'

function StatCard({ icon: Icon, label, value, sub, color = 'ocean', to }) {
  const colors = {
    ocean: 'bg-brand-50 border-brand-200 text-brand-600',
    teal: 'bg-accent-50 border-accent-500/20 text-accent-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600',
    red: 'bg-red-50 border-red-200 text-red-500',
  }
  const card = (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {to && <ArrowRight className="w-4 h-4 text-slate-700" />}
      </div>
      <p className="font-display font-bold text-3xl text-slate-900 mt-4">{value ?? '—'}</p>
      <p className="text-sm font-semibold text-slate-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
  return to ? <Link to={to}>{card}</Link> : card
}

const priorityIcon = { hot: Flame, warm: Thermometer, cold: Snowflake }
const priorityColor = { hot: 'text-red-500 bg-red-50', warm: 'text-amber-500 bg-amber-50', cold: 'text-blue-500 bg-blue-50' }

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [counts, setCounts] = useState({ projects: 0, blogs: 0, jobs: 0 })
  const [loading, setLoading] = useState(true)
  const [analyticsStats, setAnalyticsStats] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [eStats, enquiries, projects, blogs, jobs, aStats] = await Promise.allSettled([
          enquiryAPI.getStats(),
          enquiryAPI.getAll({ limit: 5 }),
          projectAPI.getAllAdmin(),
          blogAPI.getAllAdmin(),
          jobAPI.getAll(),
          analyticsAPI.getStats(),          
        ])
        if (eStats.status === 'fulfilled') setStats(eStats.value.data)
        if (enquiries.status === 'fulfilled') setRecentEnquiries(enquiries.value.data.enquiries || [])
        if (aStats.status === 'fulfilled') {
          setAnalyticsStats(aStats.value.data)
        }
        setCounts({
          projects: projects.status === 'fulfilled' ? (projects.value.data.projects?.length || 0) : 0,
          blogs: blogs.status === 'fulfilled' ? (blogs.value.data.blogs?.length || 0) : 0,
          jobs: jobs.status === 'fulfilled' ? (jobs.value.data.jobs?.length || 0) : 0,
          visitors: aStats.status === 'fulfilled' ? (aStats.value.data.totalVisitors || 0) : 0,
          views: aStats.status === 'fulfilled' ? (aStats.value.data.totalViews || 0) : 0,
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      <Helmet><title>Dashboard — Cenovie Admin</title></Helmet>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display font-bold text-slate-900 text-2xl">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of Cenovie's content and leads</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={MessageSquare} label="Total Enquiries" value={stats?.total} sub={`${stats?.newCount || 0} new`} color="ocean" to="/admin/enquiries" />
          <StatCard icon={Flame} label="Hot Leads" value={stats?.hotLeads} sub="Needs immediate attention" color="red" to="/admin/enquiries" />
          <StatCard icon={FolderKanban} label="Projects" value={counts.projects} color="teal" to="/admin/projects" />
          <StatCard icon={FileText} label="Blog Posts" value={counts.blogs} color="amber" to="/admin/blogs" />
          <StatCard icon={Eye} label="Total Views" value={counts.views} color="blue" to="/admin/" />
          <StatCard icon={Users} label="Total Visitors" value={counts.visitors} color="green" to="/admin/" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Enquiries */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
              <h2 className="font-display font-semibold text-slate-900">Recent Enquiries</h2>
              <Link to="/admin/enquiries" className="text-brand-600 hover:text-brand-600 text-sm transition-colors">View all →</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="py-12 text-center text-slate-500 text-sm">Loading…</div>
              ) : recentEnquiries.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">No enquiries yet</div>
              ) : recentEnquiries.map(e => {
                const P = priorityIcon[e.aiInsights?.priority] || Thermometer
                return (
                  <Link key={e._id} to={`/admin/enquiries/${e._id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${priorityColor[e.aiInsights?.priority] || 'text-slate-500 bg-slate-100'}`}>
                      <P className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{e.name}</p>
                      <p className="text-xs text-slate-500 truncate">{e.subject}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-500">{new Date(e.createdAt).toLocaleDateString('en-IN')}</p>
                      {!e.isRead && <span className="inline-block w-2 h-2 rounded-full bg-brand-400 mt-1" />}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-slate-900">Quick Actions</h2>
            {[
              { label: 'New Project', to: '/admin/projects/new', icon: FolderKanban },
              { label: 'New Blog Post', to: '/admin/blogs/new', icon: FileText },
              { label: 'Manage Services', to: '/admin/services', icon: Briefcase },
              { label: 'View Jobs', to: '/admin/jobs', icon: Users },
            ].map(({ label, to, icon: Icon }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-brand-200 hover:bg-brand-50 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition-colors">{label}</span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-600 ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
