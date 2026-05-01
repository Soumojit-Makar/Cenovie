import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { serviceAPI } from '../services/api'
import { PageHero, CTABanner, LoadingSpinner } from '../components/ui/index.jsx'
import EnquiryForm from '../components/forms/EnquiryForm'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    serviceAPI.getOne(slug)
      .then(r => setService(r.data.service))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="pt-32"><LoadingSpinner /></div>
  if (notFound || !service) return (
    <div className="pt-32 text-center py-20">
      <h2 className="font-display text-2xl text-slate-900 mb-4">Service not found</h2>
      <Link to="/services" className="btn-primary">Back to Services</Link>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{service.title} — Cenovie</title>
        <meta name="description" content={service.summary} />
      </Helmet>

      <PageHero
        label="Our Services"
        title={service.title}
        subtitle={service.summary}
        // img={service.icon}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.title }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">

              {/* Business Problem */}
              {service.businessProblem && (
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900 mb-4">The Challenge</h2>
                  <div className="p-6 rounded-2xl bg-red-100 border border-red-300">
                    <p className="text-slate-900 leading-relaxed">{service.businessProblem}</p>
                  </div>
                </div>
              )}

              {/* Solution */}
              {service.solutionOffered && (
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900 mb-4">Our Solution</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">{service.solutionOffered}</p>
                </div>
              )}

              {/* Description */}
              {service.description && (
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900 mb-4">Overview</h2>
                  <p className="text-slate-600 leading-relaxed">{service.description}</p>
                </div>
              )}

              {/* Features */}
              {service.features?.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Capabilities & Features</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((f) => (
                      <div key={f} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-500">
                        <CheckCircle className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {service.benefits?.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Business Outcomes</h2>
                  <div className="space-y-3">
                    {service.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-3">
                        <ArrowRight className="w-4 h-4 text-brand-500 flex-shrink-0" />
                        <span className="text-slate-700">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Industries */}
              {service.industries?.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900 mb-4">Industries That Benefit</h2>
                  <div className="flex flex-wrap gap-2">
                    {service.industries.map((i) => (
                      <span key={i} className="badge-blue">{i}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-brand-600 rounded-xl p-6 sticky top-24">
                <h3 className="font-display font-bold text-white text-xl mb-2">Interested in this service?</h3>
                <p className="text-brand-100 text-sm mb-6">Tell us about your requirements and we'll respond within 1–2 days.</p>
                <EnquiryForm compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title={`Ready to implement ${service.title}?`}
        subtitle="Our engineers are ready to discuss your specific requirements."
        primaryLabel="Get in Touch"
        primaryTo="/contact"
        secondaryLabel="All Services"
        secondaryTo="/services"
      />
    </>
  )
}
