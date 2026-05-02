import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Cloud,
  Brain,
  Smartphone,
  Globe,
  Shield,
  BarChart3,
  Star,
  ChevronRight,
  Zap,
  Users,
  Trophy,
  Clock,
} from "lucide-react";

import {
  SectionHeader,
  ProjectCard,
  BlogCard,
} from "../components/ui/index.jsx";

import { serviceAPI, projectAPI, blogAPI } from "../services/api";

// ✅ FIX: change "assates" to "assets" if your folder name is assets
import HeroImage from "../assates/background-image.png";

/* ── Stat counter ──────────────────────────────────────── */
function StatItem({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
        {value}
      </p>
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
}

/* ── Feature pill ──────────────────────────────────────── */
function FeaturePill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 bg-white/8 border border-white/12 rounded-full text-sm text-white/70">
      <Icon className="w-3.5 h-3.5 text-gold-400" />
      {label}
    </div>
  );
}

/* ── Tech badge ────────────────────────────────────────── */
const techStack = [
  "React.js",
  "Node.js",
  "TypeScript",
  "Python",
  "Next.js",
  "AWS",
  "GCP",
  "Azure",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "Kubernetes",
  "FastAPI",
  "GraphQL",
  "Redis",
  "TensorFlow",
  "Flutter",
  "React Native",
  "Terraform",
  "CI/CD",
];

/* ── Process step ──────────────────────────────────────── */
function ProcessStep({ number, title, description }) {
  return (
    <div className="relative flex gap-5">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
        <span className="font-display font-bold text-navy-900 text-sm">
          {number}
        </span>
      </div>

      <div>
        <h4 className="font-display font-semibold text-brand-900 mb-1">
          {title}
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ── Testimonial ───────────────────────────────────────── */
function TestimonialCard({ name, role, company, text }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-gold-300 hover:shadow-gold transition-all duration-200">
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-gold-400 text-gold-400"
          />
        ))}
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">
        "{text}"
      </p>

      <div>
        <p className="text-sm font-semibold text-brand-900">{name}</p>
        <p className="text-xs text-slate-400">
          {role} · {company}
        </p>
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: "Arjun Sharma",
    role: "CTO",
    company: "FinTech Startup",
    text: "Cenovie built our entire banking platform in 6 months. The code quality, architecture, and engineering culture are world-class.",
  },
  {
    name: "Priya Nair",
    role: "VP Engineering",
    company: "Healthcare SaaS",
    text: "We migrated our legacy system to the cloud with zero downtime. Cenovie's DevOps team is truly enterprise-grade.",
  },
  {
    name: "Rahul Gupta",
    role: "Founder & CEO",
    company: "E-commerce Platform",
    text: "Our platform now handles 10x traffic after Cenovie's architecture overhaul. They think like product owners.",
  },
  {
    name: "Sneha Joshi",
    role: "Director of Tech",
    company: "Logistics Enterprise",
    text: "The AI-powered route optimization system Cenovie built saves us ₹2Cr/year. Genuinely impressive technical depth.",
  },
  {
    name: "Vikram Menon",
    role: "Co-founder",
    company: "EdTech Scale-up",
    text: "From MVP to 500K users in 18 months. Cenovie scaled every part of our product seamlessly.",
  },
  {
    name: "Deepika Reddy",
    role: "Head of Product",
    company: "InsurTech Company",
    text: "Best engineering partnership we've had. Cenovie challenges assumptions and delivers better outcomes.",
  },
];

const coreServices = [
  {
    icon: Code2,
    title: "Custom Software Development",
    desc: "Tailor-made web and backend applications built to scale, from MVP to enterprise.",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps Solutions",
    desc: "AWS, GCP, Azure architecture, CI/CD pipelines, and container orchestration.",
  },
  {
    icon: Brain,
    title: "AI & Data Solutions",
    desc: "Machine learning models, NLP systems, predictive analytics, and LLM integrations.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "Native iOS, Android, and cross-platform apps built for performance and UX.",
  },
  {
    icon: Globe,
    title: "Enterprise Web Solutions",
    desc: "SaaS platforms, portals, and enterprise-grade web applications at any scale.",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    desc: "Application security audits, pen testing, SOC2 readiness, and secure architecture.",
  },
];

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
      try {
        const [servicesRes, projectsRes, blogsRes] = await Promise.allSettled([
          serviceAPI.getAll(),
          projectAPI.getAll(),
          blogAPI.getAll(),
        ]);

        if (!isMounted) return;

        if (servicesRes.status === "fulfilled") {
          const serviceData = servicesRes.value?.data?.services;
          setServices(Array.isArray(serviceData) ? serviceData.slice(0, 6) : []);
        }

        if (projectsRes.status === "fulfilled") {
          const projectData = projectsRes.value?.data?.projects;
          setProjects(
            Array.isArray(projectData)
              ? projectData.filter((p) => p?.isFeatured).slice(0, 3)
              : []
          );
        }

        if (blogsRes.status === "fulfilled") {
          const blogData = blogsRes.value?.data?.blogs;
          setBlogs(Array.isArray(blogData) ? blogData.slice(0, 3) : []);
        }
      } catch (error) {
        console.error("Home page data fetch error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Cenovie - Enterprise Software, AI & Cloud Solutions Company</title>
        <meta
          name="description"
          content="Cenovie delivers premium software development, cloud engineering, AI solutions, mobile apps, and enterprise digital transformation services."
        />
        <meta
          name="keywords"
          content="Cenovie, software company India, IT company, AI solutions, cloud development, SaaS development, web development, mobile app development"
        />
      </Helmet>

      {/* HERO */}
      <section className="relative  overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        {/* <div className="absolute top-0 left-0 right-0 h-0.5  " /> */}

        <div
          className="absolute inset-0 "
          style={{
            backgroundImage: `url(${HeroImage})`,
            // backgroundSize: "60px 60px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-wide mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              Premium IT Solutions Partner
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-7 max-w-4xl">
              Software that
              <br />
              <span className="text-gradient-gold">
                scales your business
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed mb-10">
              Cenovie engineers custom software, cloud platforms, and AI
              systems for businesses that demand engineering excellence,
              security, and measurable results.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/contact" className="btn-primary px-7 py-3 text-base">
                Start a Project <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/projects"
                className="btn-outline-white px-7 py-3 text-base"
              >
                View Case Studies
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: Zap, label: "Fast Delivery" },
                { icon: Shield, label: "Enterprise Security" },
                { icon: Users, label: "Dedicated Teams" },
                { icon: Trophy, label: "Premium Quality" },
              ].map((p) => (
                <FeaturePill key={p.label} {...p} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      {/* <section className="bg-navy-800 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="120+" label="Projects Delivered" />
            <StatItem value="40+" label="Enterprise Clients" />
            <StatItem value="98%" label="Client Satisfaction" />
            <StatItem value="7+" label="Years of Excellence" />
          </div>
        </div>
      </section> */}

      {/* TECH MARQUEE */}
      <section className="py-10 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="flex gap-8 marquee-track w-max">
          {[...techStack, ...techStack].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="text-sm font-medium text-slate-400 whitespace-nowrap px-2 hover:text-gold-600 transition-colors cursor-default"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="What We Do"
            title="End-to-end IT engineering"
            subtitle="From product development to large-scale enterprise transformation — we cover the complete technology lifecycle."
            center
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {services.map((s) => (
              <Link to={`/services/${s.slug}`} key={s.title} className="group">
                <div
                  key={s.title}
                  className="card  group hover:border-gold-300 gold-shimmer"
                >
                  <img src={s.heroImage} alt={s.title}  className=" object-cover w-full h-auto"/>
                <div className="mt-4 p-6">
                <h3 className="font-display font-semibold text-brand-900 mb-2">
                  {s.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {s.summary}
                </p>
                </div>
              </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline">
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader
                label="Our Process"
                title="Engineering built for outcomes"
                subtitle="We combine strong engineering practices with product thinking, so every line of code supports your business growth."
              />

              <div className="space-y-7 mt-8">
                <ProcessStep
                  number="01"
                  title="Discovery & Architecture"
                  description="We understand your business goals, define the right architecture, and prepare a practical execution roadmap."
                />
                <ProcessStep
                  number="02"
                  title="Agile Build Cycles"
                  description="We work in clear sprint cycles with regular demos, transparent progress, and fast feedback."
                />
                <ProcessStep
                  number="03"
                  title="Quality & Security First"
                  description="Code reviews, testing, performance checks, and security best practices are part of every release."
                />
                <ProcessStep
                  number="04"
                  title="Deploy & Scale"
                  description="We handle deployment, monitoring, optimization, and scaling so your product grows smoothly."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Clock,
                  label: "On-time Delivery",
                  sub: "Clear milestones",
                },
                {
                  icon: Shield,
                  label: "Security Audited",
                  sub: "Every release cycle",
                },
                {
                  icon: Users,
                  label: "Dedicated Teams",
                  sub: "Full ownership model",
                },
                {
                  icon: BarChart3,
                  label: "Measurable ROI",
                  sub: "Business-first approach",
                },
              ].map((item) => (
                <div key={item.label} className="card p-5">
                  <div className="w-9 h-9 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center mb-3">
                    <item.icon className="w-4 h-4 text-gold-600" />
                  </div>

                  <p className="font-display font-semibold text-brand-900 text-sm mb-1">
                    {item.label}
                  </p>

                  <p className="text-xs text-slate-400">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      {projects.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                label="Case Studies"
                title="Work that speaks for itself"
                subtitle="Real projects. Measurable outcomes."
              />

              <Link
                to="/projects"
                className="hidden md:flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-gold-600 transition-colors"
              >
                All case studies <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => (
                <ProjectCard key={p._id || p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            label="Client Stories"
            title="Trusted by technology leaders"
            subtitle="From startups to enterprises — here's what our clients say."
            center
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      {blogs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                label="Insights"
                title="Engineering perspectives"
              />

              <Link
                to="/insights"
                className="hidden md:flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-gold-600 transition-colors"
              >
                All articles <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((b) => (
                <BlogCard key={b._id || b.slug} blog={b} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative bg-navy-900 py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #d4920f 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-72 bg-gold-500/6 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="section-label mb-4">Let's Build Together</p>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            Your next great product
            <br />
            starts with a conversation
          </h2>

          <p className="text-white/50 text-base mb-10 max-w-lg mx-auto">
            Tell us your challenge. Cenovie will help you turn it into a
            scalable, secure, and premium digital product.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn-primary px-8 py-3.5 text-base justify-center"
            >
              Start a Project <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/about"
              className="btn-outline-white px-8 py-3.5 text-base justify-center"
            >
              About Cenovie
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}