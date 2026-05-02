import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Hexagon } from "lucide-react";

const services = [
  { label: "Custom Software Development", to: "/services/custom-software-development" },
  { label: "Full Stack Development",       to: "/services/full-stack-development" },
  { label: "Mobile App Development",       to: "/services/mobile-app-development" },
  { label: "Cloud & DevOps Solutions",     to: "/services/cloud-devops-solutions" },
  { label: "AI & Data Solutions",          to: "/services/ai-data-solutions" },
  { label: "Enterprise Web Solutions",     to: "/services/enterprise-web-solutions" },
  { label: "UI/UX & Product Design",       to: "/services/ui-ux-product-design" },
  { label: "API & Systems Integration",    to: "/services/api-integration" },
  { label: "QA & Testing Services",        to: "/services/qa-testing" },
  { label: "IT Consulting",                to: "/services/it-consulting" },
  { label: "Digital Transformation",       to: "/services/digital-transformation" },
  { label: "SaaS Development",             to: "/services/saas-development" },
];

const links = [
  { label: "Home",         to: "/",         end: true },
  { label: "About",        to: "/about" },
  { label: "Services",     to: "/services", dropdown: services },
  { label: "Case Studies", to: "/projects" },
  { label: "Insights",     to: "/insights" },
  { label: "Careers",      to: "/careers" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy-900/98 backdrop-blur-md shadow-navy border-b border-white/5"
            : "bg-navy-900 border-b border-white/8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[68px]">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9">
              <div className="absolute inset-0 bg-gold-500 rounded-lg rotate-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative font-display font-bold text-navy-900 text-sm tracking-tight">CN</span>
            </div>
            <span className="font-display font-bold text-gray-400 text-xl tracking-tight">
              Ceno<span className="text-gold-400">vie</span>
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith("/services")
                        ? "text-gray-400 bg-gold-400/10"
                        : "text-gray-400 hover:text-gold-400 hover:bg-gold-400/10"
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-navy-900 border border-white/12 rounded-xl shadow-2xl overflow-hidden"
                      >
                        {/* Gold top line */}
                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                        <div className="p-2">
                          {services.map((s) => (
                            <Link
                              key={s.to}
                              to={s.to}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/8 transition-colors group"
                            >
                              <span className="w-1 h-1 rounded-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-gold-400 bg-gold-400/10"
                        : "text-gray-400 hover:text-gold-400 hover:bg-gold-400/10"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/contact" className="btn-primary text-sm px-5 py-2">
              Get a Quote
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-navy-900 border-l border-white/10 overflow-y-auto no-scrollbar"
            >
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gold-500 rounded-md flex items-center justify-center">
                    <span className="font-display font-bold text-navy-900 text-xs">CN</span>
                  </div>
                  <span className="font-display font-bold text-white">Ceno<span className="text-gold-400">vie</span></span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-3 space-y-0.5">
                {links.map((link) =>
                  link.dropdown ? (
                    <div key={link.label}>
                      <p className="px-3 pt-5 pb-2 text-xs font-bold text-gold-500 uppercase tracking-widest">
                        Services
                      </p>
                      {services.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="block px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-colors"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                          isActive ? "text-gold-400 bg-white/8" : "text-white/70 hover:text-white hover:bg-white/8"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ),
                )}
                <div className="pt-4 mt-2 border-t border-white/8">
                  <Link to="/contact" className="btn-primary w-full justify-center">
                    Get a Quote
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
