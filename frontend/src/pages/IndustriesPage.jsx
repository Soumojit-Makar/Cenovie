import { Helmet } from 'react-helmet-async'
import { Building2, ShoppingCart, Heart, Zap, Truck, Code2, Shield, Globe, BarChart3, Users, CheckCircle } from 'lucide-react'
import { PageHero, CTABanner } from '../components/ui/index.jsx'

const industries = [
  { icon: BarChart3,   title: 'FinTech & Banking',         desc: 'Core banking platforms, payment systems, lending engines, KYC/AML compliance, and regulatory-ready financial software.', useCases: ['Core Banking Systems', 'Payment Gateway Integration', 'KYC/AML Automation', 'Lending Platforms', 'Trading & Portfolio Apps'] },
  { icon: Heart,       title: 'Healthcare & Life Sciences', desc: 'HIPAA-compliant EMR systems, telemedicine platforms, clinical trials software, and ABDM-integrated health data solutions.', useCases: ['Electronic Medical Records', 'Telemedicine Platforms', 'Hospital Management', 'Clinical Trial Software', 'Health Analytics'] },
  { icon: ShoppingCart,title: 'E-commerce & Retail',       desc: 'High-performance storefronts, headless commerce, inventory management, seller portals, and marketplace platforms.', useCases: ['E-commerce Platforms', 'Headless Commerce', 'Inventory Management', 'Seller Portals', 'Recommendation Engines'] },
  { icon: Truck,       title: 'Logistics & Supply Chain',  desc: 'Route optimization, fleet management, warehouse management systems, and real-time supply chain visibility platforms.', useCases: ['Route Optimization AI', 'Fleet Management', 'Warehouse Management', 'Order Tracking', 'Demand Forecasting'] },
  { icon: Building2,   title: 'Enterprise & Manufacturing', desc: 'Custom ERP systems, cloud migration, manufacturing operations platforms, and enterprise data integration solutions.', useCases: ['Custom ERP Systems', 'Cloud Migration', 'IoT & OT Integration', 'Quality Management', 'Production Analytics'] },
  { icon: Users,       title: 'HR Tech & EdTech',          desc: 'Workforce management platforms, LMS solutions, e-learning applications, talent management, and payroll automation.', useCases: ['HR Management Platforms', 'Learning Management Systems', 'Payroll Automation', 'Performance Management', 'Talent Analytics'] },
  { icon: Globe,       title: 'Government & Public Sector', desc: 'Citizen service portals, government process automation, digital ID systems, and compliant public data platforms.', useCases: ['Citizen Portals', 'e-Governance Systems', 'Document Management', 'Public Analytics', 'Compliance Platforms'] },
  { icon: Shield,      title: 'InsurTech',                 desc: 'Policy management systems, claims automation, underwriting engines, fraud detection, and customer-facing insurance portals.', useCases: ['Policy Management', 'Claims Processing', 'Fraud Detection AI', 'Underwriting Engines', 'Customer Portals'] },
  { icon: Zap,         title: 'Energy & Utilities',        desc: 'SCADA integration, grid management dashboards, energy analytics, smart meter data platforms, and utility customer portals.', useCases: ['Grid Management Systems', 'Energy Analytics', 'Smart Meter Platforms', 'Predictive Maintenance', 'Customer Self-service'] },
  { icon: Code2,       title: 'SaaS & Startups',           desc: 'Full-product SaaS development from idea to scale — multi-tenant architecture, billing, onboarding, and growth infrastructure.', useCases: ['SaaS Product Development', 'MVP to Scale', 'Multi-tenant Architecture', 'Subscription Billing', 'Growth Analytics'] },
]

export default function IndustriesPage() {
  return (
    <>
      <Helmet>
        <title>Industries — Cenovie IT Solutions</title>
        <meta name="description" content="Cenovie delivers industry-specific software solutions for FinTech, Healthcare, E-commerce, Logistics, Enterprise, and more." />
      </Helmet>
      <PageHero label="Industries" title="Deep expertise across 10 sectors"
        subtitle="We don't just write code — we understand your industry's regulatory constraints, user behaviors, and competitive dynamics."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Industries' }]}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {industries.map(({ icon: Icon, title, desc, useCases }) => (
              <div key={title} className="card p-6 hover:border-gold-300 hover:shadow-gold transition-all gold-shimmer">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-brand-900 mb-1">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {useCases.map(u => (
                    <span key={u} className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3 text-gold-500 flex-shrink-0" />{u}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTABanner
        title="Don't see your industry?"
        subtitle="We've built software across many verticals. Tell us your sector and we'll share relevant experience."
        primaryLabel="Discuss Your Industry"
        primaryTo="/contact"
      />
    </>
  )
}
