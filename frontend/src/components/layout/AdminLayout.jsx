import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, MessageSquare, FolderKanban, Briefcase, FileText, Users, LogOut, Code2, Image } from 'lucide-react'

const links = [
  { label: 'Dashboard',     to: '/admin',           icon: LayoutDashboard, end: true },
  { label: 'Enquiries',     to: '/admin/enquiries', icon: MessageSquare },
  { label: 'Projects',      to: '/admin/projects',  icon: FolderKanban },
  { label: 'Services',      to: '/admin/services',  icon: Briefcase },
  { label: 'Blog / Insights',to: '/admin/blogs',    icon: FileText },
  { label: 'Careers',       to: '/admin/jobs',      icon: Users },
  { label: 'Media',         to: '/admin/media',     icon: Image },
]

export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
            <Code2 className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-bold text-brand-900 text-sm leading-none">Ceno<span style={{color:"#d4920f"}}>vie</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
          {links.map(({ label, to, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-semibold text-slate-800 truncate">{admin?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{admin?.email}</p>
          </div>
          <button onClick={() => { logout(); navigate('/admin/login') }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  )
}
