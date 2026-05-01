import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FolderOpen } from "lucide-react";
import { projectAPI } from "../services/api";
import {
  PageHero,
  ProjectCard,
  LoadingSpinner,
  EmptyState,
  CTABanner,
} from "../components/ui/index.jsx";
import Project from '../assates/project.png';
const cats = [
  { value: "", label: "All" },
  { value: "custom-software", label: "Custom Software" },
  { value: "full-stack", label: "Full Stack" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "cloud-devops", label: "Cloud & DevOps" },
  { value: "ai-data", label: "AI & Data" },
  { value: "saas", label: "SaaS" },
  { value: "enterprise", label: "Enterprise" }
  
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("");

  useEffect(() => {
    setLoading(true);
    const p = {};
    if (cat) p.category = cat;
    projectAPI
      .getAll(p)
      .then((r) => setProjects(r.data.projects || []))
      .finally(() => setLoading(false));
  }, [cat]);

  return (
    <>
      <Helmet>
        <title>Projects — Cenovie</title>
      </Helmet>
      <PageHero
      img={Project}
        label="Projects"
        title="Our work"
        subtitle="Delivered software projects for FinTech, Healthcare, E-commerce, Logistics, and Enterprise clients."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Projects" }]}
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 mb-8">
            {cats.map((c) => (
              <button
                key={c.value}
                onClick={() => setCat(c.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === c.value
                    ? "bg-brand-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : projects.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="No projects found"
              description="Try a different filter."
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>
      <CTABanner
        title="Let's build your success story"
        primaryLabel="Start a Project"
        primaryTo="/contact"
      />
    </>
  );
}
