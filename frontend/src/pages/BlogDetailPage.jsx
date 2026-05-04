import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, Clock, Tag, ArrowLeft, Eye, BarChart2, Monitor, Smartphone, Tablet } from 'lucide-react'
import { blogAPI, analyticsAPI } from '../services/api'
import { LoadingSpinner, CTABanner } from '../components/ui/index.jsx'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageMeta, setPageMeta] = useState(null)

  useEffect(() => {
    blogAPI.getOne(slug)
      .then(r => {
        setBlog(r.data.blog)
        // Fire page-view tracking silently
        analyticsAPI.trackPageView(`/insights/${slug}`).catch(() => {})
        // Load 30-day analytics snapshot for the metadata widget
        analyticsAPI.getStats({ page: `/insights/${slug}`, days: 30 })
          .then(s => setPageMeta(s.data))
          .catch(() => {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="pt-32"><LoadingSpinner /></div>
  if (!blog) return (
    <div className="pt-32 text-center py-20">
      <h2 className="font-display text-2xl text-slate-900 mb-4">Article not found</h2>
      <Link to="/insights" className="btn-primary">Back to Insights</Link>
    </div>
  )

  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <>
      <Helmet>
        <title>{blog.title} — Cenovie Insights</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
      </Helmet>

      {/* Hero */}
      <section className="relative bg-brand-600 pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern" />
        {blog.coverImage && (
          <div className="absolute inset-0">
            <img src={blog.coverImage} alt="" className="w-full h-full object-cover opacity-10" />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/insights" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-400 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="badge badge-ocean capitalize">{blog.category?.replace(/-/g, ' ')}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{blog.title}</h1>
          <p className="text-slate-300 text-xl leading-relaxed mb-8">{blog.excerpt}</p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
                {blog.author?.name?.[0] || 'D'}
              </div>
              {blog.author?.name || 'Cenovie Team'}
            </span>
            {date && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{date}</span>}
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{blog.readTime} min read</span>
          </div>
        </div>
      </section>

      {/* Cover image */}
      {blog.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="rounded-lg overflow-hidden shadow-2xl border border-slate-200">
            <img src={blog.coverImage} alt={blog.title} className="w-full aspect-video object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Article */}
            <article className="lg:col-span-3">
              {blog.content ? (
                <div
                  className="prose prose-slate prose-lg max-w-none
                    prose-headings:font-display prose-headings:text-slate-900
                    prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-900
                    prose-code:text-brand-700 prose-code:bg-brand-50 prose-code:px-1 prose-code:rounded"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <p className="text-slate-600 text-lg leading-relaxed">{blog.excerpt}</p>
              )}

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag className="w-4 h-4 text-slate-400" />
                    {blog.tags.map(t => (
                      <span key={t} className="text-xs px-3 py-1 bg-white text-slate-400 rounded border border-slate-200 hover:bg-brand-50 hover:text-brand-600 transition-colors cursor-pointer">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="card p-5 bg-white">
                  <h3 className="font-display font-semibold text-slate-900 text-sm mb-3">About the Author</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-sm">
                      {blog.author?.name?.[0] || 'D'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{blog.author?.name || 'Cenovie Team'}</p>
                      {blog.author?.bio && <p className="text-xs text-slate-500 leading-relaxed mt-1">{blog.author.bio}</p>}
                    </div>
                  </div>
                </div>

                {/* ── Article Meta / Analytics Widget ───────────────── */}
                <div className="card p-5 bg-white border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-4 h-4 text-brand-600" />
                    <h3 className="font-display font-semibold text-slate-900 text-sm">Article Info</h3>
                  </div>

                  {/* All-time views (from blog doc) */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Eye className="w-3.5 h-3.5" /> Total views
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{blog.views ?? 0}</span>
                  </div>

                  {/* 30-day views from analytics */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <BarChart2 className="w-3.5 h-3.5" /> Last 30 days
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {pageMeta ? pageMeta.total : <span className="text-slate-300">—</span>}
                    </span>
                  </div>

                  {/* Device breakdown */}
                  {pageMeta?.byDevice?.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs text-slate-400 mb-2">Visitors by device</p>
                      {pageMeta.byDevice.map(d => {
                        const Icon = d._id === 'mobile' ? Smartphone : d._id === 'tablet' ? Tablet : Monitor
                        const pct = pageMeta.total > 0 ? Math.round((d.count / pageMeta.total) * 100) : 0
                        return (
                          <div key={d._id} className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-1.5 rounded-full bg-brand-500 transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <p className="text-[10px] text-slate-300 mt-3">Stats update on each visit</p>
                </div>

                <div className="bg-brand-600 rounded-xl p-5">
                  <h3 className="font-display font-semibold text-white text-sm mb-2">Have a software challenge?</h3>
                  <p className="text-brand-100 text-xs mb-4">Our specialists are ready to help you transform your location data into decisions.</p>
                  <Link to="/contact" className="btn-primary text-xs py-2 px-4 justify-center w-full">Get in Touch</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTABanner
        title="Enjoyed this article?"
        subtitle="Explore more engineering insights or reach out to discuss how these concepts apply to your organization."
        primaryLabel="More Insights"
        primaryTo="/insights"
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </>
  )
}
