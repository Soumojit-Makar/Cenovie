import { Helmet } from "react-helmet-async";
import { Target, Eye, CheckCircle, Zap, ShieldCheck, Users, Award, Globe } from "lucide-react";
import { PageHero, CTABanner, SectionHeader } from "../components/ui/index.jsx";
import { Star } from "lucide-react";

const team = [
  { name: "S. Chakraborty", role: "Founder & CEO",               bio: "Leads company strategy and enterprise client partnerships. 12+ years in enterprise software delivery and digital transformation." },
  { name: "P. Sharma",      role: "Chief Technology Officer",     bio: "Drives cloud architecture, engineering standards, and technology innovation across all product verticals." },
  { name: "A. Roy",         role: "Head of Engineering",          bio: "Full-stack expert and engineering team lead responsible for delivery quality across all client projects." },
  { name: "S. Banerjee",    role: "Head of AI & Data",            bio: "ML/AI specialist building intelligent systems — from NLP models to real-time predictive analytics platforms." },
  { name: "J. Mehta",       role: "Head of Client Success",       bio: "Ensures every client engagement delivers measurable outcomes. Manages onboarding, delivery, and long-term partnerships." },
];

const testimonials = [
  { name: "Arjun Sharma",  role: "CTO · FinTech Startup",        text: "Cenovie rebuilt our core banking infrastructure with exceptional architecture. The code quality and engineering culture are simply world-class." },
  { name: "Priya Nair",    role: "VP Engineering · Healthcare",   text: "Zero-downtime cloud migration, flawless DevOps handover, and an engineering team that actually owns outcomes. Rare to find." },
  { name: "Rahul Gupta",   role: "Founder · E-commerce Platform", text: "We went from 1M to 10M users post-Cenovie's architecture overhaul. They think like product owners, not just contractors." },
];

const milestones = [
  { year: "2017", event: "Cenovie founded in Kolkata with a vision to deliver enterprise-grade software to ambitious businesses across India." },
  { year: "2018", event: "First enterprise client — delivered a full-stack ERP integration for a logistics company in 90 days." },
  { year: "2019", event: "Expanded into cloud solutions; AWS Advanced Partner status achieved." },
  { year: "2020", event: "Launched AI & Data practice. First ML model in production serving 500K+ daily predictions." },
  { year: "2021", event: "Crossed 50 enterprise clients. Opened dedicated DevOps and mobile development verticals." },
  { year: "2022", event: "Recognized as one of India's Top 25 IT Solution Providers by TechIndia Magazine." },
  { year: "2023", event: "100+ projects delivered. Expanded team to 80+ engineers across full-stack, cloud, AI, and mobile." },
  { year: "2024", event: "Launched SaaS and product engineering practice. Now serving clients across 8 countries." },
];

const values = [
  { icon: Target,     title: "Outcome Obsession",  desc: "We don't measure success by tickets closed — we measure it by business results our clients achieve." },
  { icon: ShieldCheck,title: "Engineering Integrity",desc: "Clean code, rigorous reviews, automated tests, and security built-in — not bolted on." },
  { icon: Users,      title: "Client Partnership",  desc: "We work inside your business rhythm, not against it. Transparent communication at every step." },
  { icon: Zap,        title: "Speed with Quality",  desc: "Agile delivery without technical debt. We move fast and maintain architectural discipline." },
  { icon: Eye,        title: "Radical Transparency",desc: "Weekly demos, open access to metrics, honest timelines. No surprises." },
  { icon: Globe,      title: "Global Ambition",     desc: "Building products that compete globally from our base in India — the world's software capital." },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Cenovie | Premium IT & Software Engineering</title>
        <meta name="description" content="Cenovie is a premium IT and software engineering company delivering custom software, cloud, AI, and digital transformation solutions from Kolkata, India." />
      </Helmet>

      <PageHero
        label="About Us"
        title="Built by engineers. Measured by outcomes."
        subtitle="Cenovie is a premium software engineering company helping enterprises unlock competitive advantage through technology."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      {/* ── Mission & Vision ──────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 border-l-4 border-l-gold-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center">
                  <Target className="w-5 h-5 text-gold-600" />
                </div>
                <h3 className="font-display font-bold text-brand-900 text-lg">Our Mission</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                To engineer software products that become genuine competitive advantages for our clients — delivered with speed, quality, and lasting architectural integrity.
              </p>
            </div>
            <div className="card p-8 border-l-4 border-l-brand-400">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-display font-bold text-brand-900 text-lg">Our Vision</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                To be the most trusted software engineering partner for enterprises across Asia and beyond — known for technical excellence, business impact, and an engineering culture that attracts the world's best talent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <section className="bg-navy-900 py-14 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "120+", label: "Projects Delivered" },
              { value: "40+",  label: "Enterprise Clients" },
              { value: "80+",  label: "Engineers" },
              { value: "8",    label: "Countries Served" },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-gold-400 mb-1">{s.value}</p>
                <p className="text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Our Values" title="The principles we build on" subtitle="Every engineering decision at Cenovie is guided by these six principles." center />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {values.map(v => (
              <div key={v.title} className="card p-6 hover:border-gold-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-gold-600" />
                </div>
                <h4 className="font-display font-semibold text-brand-900 mb-2">{v.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ───────────────────────────────────────── */}
  { /*   <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Our Journey" title="7 years of engineering excellence" center />
          <div className="mt-12 relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-gradient-to-b from-gold-400/60 via-brand-300/40 to-transparent" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-6 items-start">
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="font-display font-bold text-gold-500 text-sm">{m.year}</span>
                  </div>
                  <div className="relative flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-gold-500 border-2 border-white shadow" />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pt-0.5">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
*/}
      {/* ── Team ───────────────────────────────────────────── */}
   {  /* <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Leadership" title="Meet the team" subtitle="Experienced engineers and business leaders who've delivered 120+ enterprise projects." center />
          <div className="flex flex-wrap justify-center gap-5 mt-10">
            {team.map(member => (
              <div key={member.name} className="card p-6 w-full sm:w-64 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy-700 to-brand-400 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-bold text-white text-xl">{member.name[0]}</span>
                </div>
                <h4 className="font-display font-semibold text-brand-900 mb-0.5">{member.name}</h4>
                <p className="text-xs text-gold-600 font-semibold mb-3">{member.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
*/}
      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Client Stories" title="What our clients say" center />
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {testimonials.map(t => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />)}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-brand-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to build something great?"
        subtitle="Let's talk about your technical challenges and how Cenovie can help you ship faster."
        primaryLabel="Start a Conversation"
        primaryTo="/contact"
        secondaryLabel="Explore Services"
        secondaryTo="/services"
      />
    </>
  );
}
