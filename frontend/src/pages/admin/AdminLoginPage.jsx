import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Code2, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    const r = await login(email, password)
    if (r.success) { toast.success('Welcome back!'); navigate('/admin') }
    else toast.error(r.message)
  }

  return (
    <>
      <Helmet><title>Admin Login — Cenovie</title></Helmet>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30">
              <Code2 className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-display font-bold text-slate-900 text-xl">Cenovie</h1>
            <p className="text-slate-500 text-sm mt-1">Admin Panel</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
            <h2 className="font-display font-bold text-slate-900 text-lg mb-6">Sign in</h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="form-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@cenovie.in" className="form-input pl-10" required />
                </div>
              </div>
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className="form-input pl-10 pr-10" required />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full btn-primary justify-center py-2.5 disabled:opacity-60">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</> : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
