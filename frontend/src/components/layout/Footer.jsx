import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, ArrowUpRight } from "lucide-react";

const services = [
  { label: "Custom Software Development", to: "/services/custom-software-development" },
  { label: "Full Stack Development",       to: "/services/full-stack-development" },
  { label: "Mobile App Development",       to: "/services/mobile-app-development" },
  { label: "Cloud & DevOps Solutions",     to: "/services/cloud-devops-solutions" },
  { label: "AI & Data Solutions",          to: "/services/ai-data-solutions" },
  { label: "Enterprise Web Solutions",     to: "/services/enterprise-web-solutions" },
];
const company = [
  { label: "About Us",    to: "/about" },
  { label: "Case Studies",to: "/projects" },
  { label: "Insights",    to: "/insights" },
  { label: "Careers",     to: "/careers" },
  { label: "Contact",     to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="relative flex items-center justify-center w-9 h-9">
                <div className="absolute inset-0 bg-gold-500 rounded-lg rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative font-display font-bold text-navy-900 text-sm">CN</span>
              </div>
              <span className="font-display font-bold text-white text-xl">
                Ceno<span className="text-gold-400">vie</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Premium IT & software solutions for enterprises ready to lead their industry through technology.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Twitter,  href: "#" },
                { icon: Github,   href: "#" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href + Icon.displayName}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-gold-500/20 hover:border-gold-500/40 border border-white/8 flex items-center justify-center text-white/50 hover:text-gold-400 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-sm text-gold-400 uppercase tracking-widest mb-5">
              Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {s.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-sm text-gold-400 uppercase tracking-widest mb-5">
              Company
            </h4>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {c.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm text-gold-400 uppercase tracking-widest mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-white/35 mb-0.5">Email</p>
                  <a href="mailto:main@cenovie.site" className="text-sm text-white/65 hover:text-white transition-colors">
                    main@cenovie.site
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-white/35 mb-0.5">Phone</p>
                  <a href="tel:+917477407178" className="text-sm text-white/65 hover:text-white transition-colors">
                    +91 7477407178
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-white/35 mb-0.5">Office</p>
                  <p className="text-sm text-white/65">Kolkata, West Bengal, India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        

        <div className="h-px w-full bg-white/8 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Cenovie Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
