import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Briefcase } from 'lucide-react'
import { serviceAPI } from '../services/api'
import { PageHero, ServiceCard, LoadingSpinner, EmptyState, CTABanner } from '../components/ui/index.jsx'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    serviceAPI.getAll().then(r => setServices(r.data.services || [])).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet>
        <title>IT Services — Cenovie</title>
        <meta name="description" content="Full-range IT services from Cenovie: custom software development, cloud solutions, AI, mobile apps, enterprise web, DevOps, and digital transformation." />
      </Helmet>
      <PageHero
        label="Services"
        title="End-to-end software engineering"
        subtitle="From greenfield product builds to large-scale enterprise transformation — we engineer solutions that move businesses forward."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? <LoadingSpinner /> : services.length === 0
            ? <EmptyState icon={Briefcase} title="Services coming soon" description="We're updating our services. Check back shortly." />
            : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{services.map(s => <ServiceCard key={s._id} service={s} />)}</div>
          }
        </div>
      </section>
      <CTABanner
        title="Need a custom solution?"
        subtitle="Describe your challenge and we'll design the right technical approach within 48 hours."
        primaryLabel="Discuss Your Requirements"
        primaryTo="/contact"
      />
    </>
  )
}
