import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, MapPin, Calendar, Building, Tag } from 'lucide-react'
import { projectAPI } from '../services/api'
import { LoadingSpinner, CTABanner } from '../components/ui/index.jsx'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectAPI.getOne(slug)
      .then(r => setProject(r.data.project))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="pt-32"><LoadingSpinner /></div>
  if (!project) return (
    <div className="pt-32 text-center py-20">
      <h2 className="font-display text-2xl text-slate-900 mb-4">Project not found</h2>
      <Link to="/projects" className="btn-primary">Back to Projects</Link>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{project.title} — Cenovie Projects</title>
        <meta name="description" content={project.shortDescription} />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-brand-600 pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern" />
        {project.heroImage && (
          <div className="absolute inset-0">
            <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover opacity-10" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-brand-500">Home</Link>
            <span>/</span>
            <Link to="/projects" className="hover:text-brand-500">Projects</Link>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-xs">{project.title}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3 text-brand-400">
            <span className="w-5 h-px bg-brand-300" />{project.category?.replace(/-/g, ' ')}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 max-w-4xl">{project.title}</h1>
          <p className="text-slate-300 text-xl max-w-2xl">{project.shortDescription}</p>
          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-slate-200">
            {project.client && <div className="flex items-center gap-2 text-sm text-slate-400"><Building className="w-4 h-4 text-brand-500" />{project.client}</div>}
            {project.location && <div className="flex items-center gap-2 text-sm text-slate-400"><MapPin className="w-4 h-4 text-brand-500" />{project.location}</div>}
            {project.year && <div className="flex items-center gap-2 text-sm text-slate-400"><Calendar className="w-4 h-4 text-brand-500" />{project.year}</div>}
            {project.duration && <div className="flex items-center gap-2 text-sm text-slate-400"><Tag className="w-4 h-4 text-brand-500" />Duration: {project.duration}</div>}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">

              {/* Hero image */}
              {project.heroImage && (
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <img src={project.heroImage} alt={project.title} className="w-full aspect-video object-cover" />
                </div>
              )}

              {/* Full description */}
              {project.fullDescription && (
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900 mb-4">Project Overview</h2>
                  <p className="text-slate-600 leading-relaxed">{project.fullDescription}</p>
                </div>
              )}

              {/* Outcomes */}
              {project.outcomes?.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Key Outcomes</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.outcomes.map((o, i) => (
                      <div key={i} className="flex items-start gap-3 p-5 rounded-xl bg-accent-50 border border-accent-200">
                        <CheckCircle className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {project.gallery?.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-slate-200 aspect-video">
                        <img src={img} alt={`${project.title} ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Technologies */}
              {project.technologies?.length > 0 && (
                <div className="card p-6 bg-white">
                  <h3 className="font-display font-semibold text-slate-900 mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(t => (
                      <span key={t} className="text-xs px-3 py-1 bg-brand-50 text-brand-700 rounded-full font-medium border border-brand-100">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags?.length > 0 && (
                <div className="card p-6 bg-white">
                  <h3 className="font-display font-semibold text-slate-900 mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(t => (
                      <span key={t} className="badge-green">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-brand-600 rounded-xl p-6">
                <h3 className="font-display font-semibold text-white mb-2">Have a similar project?</h3>
                <p className="text-brand-100 text-sm mb-4">Let's discuss how we can deliver similar results for your organization.</p>
                <Link to="/contact" className="btn-primary w-full justify-center text-sm">Start a Conversation</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to start your software project?"
        subtitle="Our team has delivered complex software solutions on time and on budget."
        primaryLabel="Get in Touch"
        primaryTo="/contact"
        secondaryLabel="All Projects"
        secondaryTo="/projects"
      />
    </>
  )
}
