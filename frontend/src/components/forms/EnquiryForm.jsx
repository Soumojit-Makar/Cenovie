import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { enquiryAPI } from '../../services/api'
import { Send, Loader2, CheckCircle } from 'lucide-react'

const SERVICES = [
  'Custom Software Development','Full Stack Development','Mobile App Development','Cloud & DevOps Solutions',
  'Software Data Engineering','Enterprise GIS Audit','GIS Implementation & Upgrade',
  'AI & Data Solutions','Enterprise Web Solutions','SaaS Development','UI/UX & Product Design',
  'GeoAI / Spatial Intelligence','Survey Data Digitization','Other',
]

export default function EnquiryForm({ compact = false }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', subject:'', message:'', serviceInterest:'' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill all required fields.')
      return
    }
    setLoading(true)
    try {
      await enquiryAPI.submit(form)
      setDone(true)
      toast.success('Enquiry submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="text-center py-10">
      <CheckCircle className="w-10 h-10 text-accent-500 mx-auto mb-3" />
      <h3 className="font-display font-bold text-slate-900 text-lg mb-1">Enquiry Received!</h3>
      <p className="text-slate-500 text-sm">We'll respond within 1–2 business days.</p>
      <button onClick={() => { setDone(false); setForm({ name:'', email:'', phone:'', company:'', subject:'', message:'', serviceInterest:'' }) }}
        className="mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium">Submit another →</button>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-4`}>
        <div>
          <label className="form-label">Full Name *</label>
          <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" className="form-input" required />
        </div>
        <div>
          <label className="form-label">Email *</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@org.in" className="form-input" required />
        </div>
        <div>
          <label className="form-label">Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className="form-input" />
        </div>
        <div>
          <label className="form-label">Organisation</label>
          <input type="text" value={form.company} onChange={set('company')} placeholder="Organisation name" className="form-input" />
        </div>
      </div>
      <div>
        <label className="form-label">Service Interest</label>
        <select value={form.serviceInterest} onChange={set('serviceInterest')} className="form-input">
          <option value="">Select (optional)</option>
          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Subject *</label>
        <input type="text" value={form.subject} onChange={set('subject')} placeholder="Brief subject" className="form-input" required />
      </div>
      <div>
        <label className="form-label">Message *</label>
        <textarea value={form.message} onChange={set('message')} rows={compact ? 4 : 5}
          placeholder="Describe your project or requirements…" className="form-input resize-none" required />
      </div>
      <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 disabled:opacity-60">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <><Send className="w-4 h-4" />Send Enquiry</>}
      </button>
      <p className="text-xs text-center text-slate-400">Response within 1–2 business days. Your info is confidential.</p>
    </form>
  )
}
