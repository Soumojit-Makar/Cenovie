import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { PageHero } from '../components/ui/index.jsx'
import { enquiryAPI } from '../services/api'

const budgets  = ["< ₹5 Lakhs", "₹5–20 Lakhs", "₹20–50 Lakhs", "₹50 Lakhs+", "Not sure yet"]
const services = [
  "Custom Software Development", "Full Stack Development", "Mobile App Development",
  "Cloud & DevOps", "AI & Data Solutions", "Enterprise Web", "UI/UX & Design",
  "IT Consulting", "Digital Transformation", "Other"
]

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' })
  const [status, setStatus]   = useState(null) // 'success' | 'error' | null
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      await enquiryAPI.create(form)
      setStatus('success')
      setForm({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Cenovie | Start a Project</title>
        <meta name="description" content="Get in touch with Cenovie to discuss your software project. We respond within 48 hours with a clear technical approach and timeline." />
      </Helmet>

      <PageHero
        label="Contact"
        title="Let's build something great"
        subtitle="Tell us your challenge. We'll respond within 48 hours with a clear technical approach and honest timeline."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="font-display font-bold text-brand-900 text-xl mb-4">Get in touch</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Whether you're starting a new product, modernizing legacy systems, or scaling your infrastructure — we'd love to hear from you.
                </p>
              </div>
              <div className="space-y-5">
                {[
                  { icon: Mail,    label: 'Email',    value: 'hello@cenovie.com',      href: 'mailto:main@cenovie.site' },
                  { icon: Phone,   label: 'Phone',    value: '+91 7477407178',         href: 'tel:+917477407178' },
                  { icon: MapPin,  label: 'Office',   value: 'Kolkata, West Bengal, India' },
                  { icon: Clock,   label: 'Response', value: 'Within 48 business hours' },
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-9 h-9 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                      {item.href
                        ? <a href={item.href} className="text-sm text-brand-800 font-medium hover:text-gold-600 transition-colors">{item.value}</a>
                        : <p className="text-sm text-brand-800 font-medium">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* What happens next */}
              <div className="bg-navy-900 rounded-xl p-6 border border-white/5">
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent -mt-6 mb-6 -mx-6 w-[calc(100%+3rem)]" />
                <h4 className="font-display font-semibold text-white text-sm mb-4">What happens next</h4>
                <div className="space-y-3">
                  {[
                    "We review your enquiry within 24 hours",
                    "A senior engineer schedules a discovery call",
                    "We share a technical approach & timeline",
                    "You decide — no pressure, no commitment",
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">{i+1}</span>
                      <p className="text-xs text-white/55 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card p-8">
                <h3 className="font-display font-bold text-brand-900 mb-6">Send us a message</h3>

                {status === 'success' && (
                  <div className="mb-6 flex gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">Message sent!</p>
                      <p className="text-xs text-green-600 mt-0.5">We'll get back to you within 48 hours.</p>
                    </div>
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-6 flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">Something went wrong. Please try again or email us directly.</p>
                  </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="Jane Smith" required />
                    </div>
                    <div>
                      <label className="form-label">Work Email *</label>
                      <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="jane@company.com" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Phone</label>
                      <input className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="form-label">Company</label>
                      <input className="form-input" name="company" value={form.company} onChange={handle} placeholder="Acme Corp" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Service Needed</label>
                      <select className="form-input" name="service" value={form.service} onChange={handle}>
                        <option value="">Select a service</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Estimated Budget</label>
                      <select className="form-input" name="budget" value={form.budget} onChange={handle}>
                        <option value="">Select budget range</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Project Details *</label>
                    <textarea
                      className="form-input min-h-[130px] resize-y"
                      name="message" value={form.message} onChange={handle}
                      placeholder="Tell us about your project — what you're building, key challenges, and timeline."
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
