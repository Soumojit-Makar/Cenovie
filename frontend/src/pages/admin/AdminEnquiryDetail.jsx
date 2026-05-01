import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Flame, Thermometer, Snowflake, Brain, Save } from 'lucide-react'
import { enquiryAPI } from '../../services/api'
import { LoadingSpinner } from '../../components/ui/index.jsx'

const statusOptions = ['new','contacted','qualified','proposal','closed-won','closed-lost']

export default function AdminEnquiryDetail() {
  const { id } = useParams()
  const [enquiry, setEnquiry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    enquiryAPI.getOne(id)
      .then(r => {
        setEnquiry(r.data.enquiry)
        setStatus(r.data.enquiry.leadStatus)
        setNotes(r.data.enquiry.notes || '')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await enquiryAPI.update(id, { leadStatus: status, notes })
      toast.success('Enquiry updated')
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner light />
  if (!enquiry) return <div className="text-slate-500">Enquiry not found</div>

  const ai = enquiry.aiInsights
  const P = { hot: Flame, warm: Thermometer, cold: Snowflake }[ai?.priority] || Thermometer
  const pColor = { hot: 'text-red-600 bg-red-50', warm: 'text-amber-600 bg-amber-50', cold: 'text-slate-500 bg-slate-100' }[ai?.priority] || 'text-slate-500 bg-slate-100'

  return (
    <>
      <Helmet><title>Enquiry: {enquiry.name} — Admin</title></Helmet>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link to="/admin/enquiries" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-slate-900 text-xl">{enquiry.name}</h1>
            <p className="text-slate-500 text-sm">{enquiry.email}</p>
          </div>
          {ai?.priority && (
            <span className={`ml-auto badge ${pColor} flex items-center gap-1.5`}>
              <P className="w-3.5 h-3.5" /> {ai.priority?.toUpperCase()} LEAD
            </span>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Contact Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['Name', enquiry.name],
                  ['Email', enquiry.email],
                  ['Phone', enquiry.phone || '—'],
                  ['Company', enquiry.company || '—'],
                  ['Service Interest', enquiry.serviceInterest || '—'],
                  ['Submitted', new Date(enquiry.createdAt).toLocaleString('en-IN')],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{k}</p>
                    <p className="text-slate-200 text-sm">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-3">Subject</h2>
              <p className="text-brand-600 font-medium mb-4">{enquiry.subject}</p>
              <h2 className="font-semibold text-slate-900 mb-3">Message</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
            </div>

            {/* AI Insights */}
            {ai && (
              <div className="bg-gradient-to-br bg-blue-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-slate-900">AI Insights</h2>
                  {ai.processedAt && (
                    <span className="text-xs text-slate-500 ml-auto">
                      {new Date(ai.processedAt).toLocaleDateString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {[
                    ['Intent', ai.intent],
                    ['Recommended Service', ai.recommendedService],
                  ].map(([k, v]) => v && (
                    <div key={k}>
                      <p className="text-xs font-semibold text-blue-600/70 uppercase tracking-wider mb-1">{k}</p>
                      <p className="text-slate-200 text-sm">{v}</p>
                    </div>
                  ))}
                </div>
                {ai.summary && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-blue-600/70 uppercase tracking-wider mb-1">Summary</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{ai.summary}</p>
                  </div>
                )}
                {ai.suggestedReply && (
                  <div>
                    <p className="text-xs font-semibold text-blue-600/70 uppercase tracking-wider mb-1">Suggested Reply</p>
                    <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-sm leading-relaxed italic border border-slate-200">
                      {ai.suggestedReply}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Lead Management</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label-dark text-xs">Lead Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}
                    className="form-input-dark capitalize text-sm"
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s} className="bg-white capitalize">{s.replace(/-/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label-dark text-xs">Internal Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                    placeholder="Add notes about this lead…"
                    className="form-input-dark resize-none text-sm"
                  />
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-3 text-sm">Quick Reply</h2>
              <a href={`mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(enquiry.subject)}`}
                className="block w-full text-center py-2.5 border border-brand-500/40 text-brand-600 hover:bg-brand-50 text-sm font-medium rounded-xl transition-all"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
