import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle,
  Code2, Globe, Smartphone, Cloud, Brain, Database,
  Settings, Zap, Shield, BarChart3, Layers, Cpu,
  Monitor, Server, GitBranch, Package,
} from "lucide-react";

/* ── SectionHeader ─────────────────────────────────────── */
export function SectionHeader({ label, title, subtitle, center = false }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {label && <p className="section-label">{label}</p>}
      <h2 className="section-title mb-3">{title}</h2>
      {subtitle && (
        <p className={`section-sub text-slate-500 ${center ? "mx-auto" : ""}`}>{subtitle}</p>
      )}
    </div>
  );
}

/* ── PageHero ──────────────────────────────────────────── */
export function PageHero({ label, title, subtitle, breadcrumb }) {
  return (
    <section className="relative overflow-hidden bg-navy-900 pt-28 pb-14">
      {/* Gold gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#d4920f 1px, transparent 1px), linear-gradient(90deg, #d4920f 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {breadcrumb && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/35 mb-5">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {b.to ? (
                  <Link to={b.to} className="hover:text-gold-400 transition-colors">{b.label}</Link>
                ) : (
                  <span className="text-white/60">{b.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        {label && <p className="section-label">{label}</p>}
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg text-white/55 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

/* ── CTABanner ─────────────────────────────────────────── */
export function CTABanner({ title, subtitle, primaryLabel = "Contact Us", primaryTo = "/contact", secondaryLabel, secondaryTo }) {
  return (
    <section className="relative bg-navy-900 py-20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, #d4920f 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 bg-gold-500/8 rounded-full blur-3xl" />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        {subtitle && <p className="text-white/50 text-base mb-8 max-w-xl mx-auto">{subtitle}</p>}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={primaryTo} className="btn-primary px-7 py-3 text-sm justify-center">
            {primaryLabel}
          </Link>
          {secondaryLabel && secondaryTo && (
            <Link to={secondaryTo} className="btn-outline-white px-7 py-3 text-sm justify-center">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── ServiceCard ───────────────────────────────────────── */
export function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || Code2;
  return (
    <Link to={`/services/${service.slug}`} className="card group flex flex-col h-full gold-shimmer">
      {service.icon && !service.icon.startsWith("http") ? (
        <div className="p-6 pb-0">
          <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5 group-hover:bg-gold-50 group-hover:border-gold-200 transition-colors">
            <Icon className="w-5 h-5 text-brand-600 group-hover:text-gold-600 transition-colors" />
          </div>
        </div>
      ) : service.icon ? (
        <div className="w-full h-40 overflow-hidden rounded-t-xl">
          <img src={service.icon} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : null}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display font-semibold text-brand-900 group-hover:text-gold-600 transition-colors mb-2">{service.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-grow">{service.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:text-gold-600 group-hover:gap-2 transition-all">
          Learn more <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

/* ── ProjectCard ───────────────────────────────────────── */
export function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="card group block overflow-hidden gold-shimmer">
      <div className="aspect-video overflow-hidden bg-navy-900 relative">
        {project.heroImage ? (
          <img src={project.heroImage} alt={project.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-900">
            <Code2 className="w-10 h-10 text-gold-500/40" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="badge-gold capitalize">{project.category?.replace(/-/g, " ")}</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-slate-400 mb-1">{project.client} · {project.year}</p>
        <h3 className="font-display font-semibold text-brand-900 text-sm leading-snug mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
          {project.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{project.shortDescription}</p>
        {project.outcomes?.[0] && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-gold-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600">{project.outcomes[0]}</p>
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── BlogCard ──────────────────────────────────────────── */
export function BlogCard({ blog }) {
  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";
  return (
    <Link to={`/insights/${blog.slug}`} className="card group block overflow-hidden gold-shimmer">
      <div className="aspect-video overflow-hidden bg-navy-900 relative">
        {blog.coverImage ? (
          <img src={blog.coverImage} alt={blog.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-900">
            <span className="font-display font-bold text-3xl text-gold-500/30">TECH</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
          <span>{date}</span>
          <span>·</span>
          <span>{blog.readTime} min read</span>
        </div>
        <h3 className="font-display font-semibold text-brand-900 text-sm leading-snug mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{blog.excerpt}</p>
      </div>
    </Link>
  );
}

/* ── Spinner / Empty ───────────────────────────────────── */
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-gold-500 rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      {Icon && (
        <div className="w-14 h-14 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-brand-400" />
        </div>
      )}
      <h3 className="font-display font-semibold text-brand-900 text-lg mb-2">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-xs mb-5">{description}</p>}
      {action}
    </div>
  );
}

/* ── Icon map (IT-focused) ─────────────────────────────── */
export const iconMap = {
  Code2, Globe, Smartphone, Cloud, Brain, Database,
  Settings, Zap, Shield, BarChart3, Layers, Cpu,
  Monitor, Server, GitBranch, Package, Code: Code2,
  // legacy GIS aliases
  MapPin: Globe, Satellite: Cpu, Building2: Monitor,
  FileText: Package, ScanLine: Layers, ClipboardCheck: CheckCircle,
};
