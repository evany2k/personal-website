"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  Code2,
  CheckCircle2,
  ArrowUpRight,
  Gamepad2,
  Leaf,
  Globe,
  BookOpen
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { projectsData, Project } from "@/data/projectsData";

export default function ProjectsClient() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  useEffect(() => {
    if (selectedProject) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProject]);
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return <Globe size={16} className="text-emerald-700" />;
      case 'data-science': return <Leaf size={16} className="text-teal-700" />;
      case 'java': return <Gamepad2 size={16} className="text-amber-700" />;
      case 'research': return <BookOpen size={16} className="text-blue-700" />;
      default: return <Code2 size={16} className="text-emerald-700" />;
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-stone-800">
      <header className="mb-12 border-b border-stone-200/80 pb-8 text-center md:text-left">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-4">My Projects</h1>
          <p className="text-lg text-stone-600 leading-relaxed text-pretty">
            A showcase of my software applications, object-oriented Java development, and environmental carbon emissions research.
          </p>
        </div>
      </header>

      <div className="space-y-10">
        {projectsData.map((project, index) => (
          <div key={project.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200/80 shadow-2xs">
                {getCategoryIcon(project.category)}
                {project.categoryLabel}
              </span>
              <div className="h-px bg-stone-200/80 flex-1" />
            </div>

            <article
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`View project details for ${project.title}`}
              onClick={() => handleCardClick(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(project);
                }
              }}
              className="group flex flex-col md:flex-row bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-500/60 transition-all duration-300 cursor-pointer touch-manipulation active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
            >
              {/* Square banner */}
              <div className={`relative w-full aspect-square md:w-[380px] lg:w-[400px] md:aspect-[4/3] shrink-0 overflow-hidden bg-stone-100 border-b md:border-b-0 md:border-r border-stone-200/60`}>
                {project.imageUrlSideBanner ? (
                  <Image
                    src={project.imageUrlSideBanner}
                    alt={project.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain object-top group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.imageGradient || 'from-emerald-800 to-stone-800'} p-6 flex items-end justify-end`}>
                    <Code2 size={120} className="text-white/10" />
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col min-w-0">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-tight">
                      {project.title}
                    </h2>
                    <span className="inline-flex items-center text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200/80 shrink-0 mt-1">
                      {project.date}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-emerald-700 mb-3">{project.subtitle}</p>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">{project.description}</p>

                  {project.highlights && project.highlights.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      {project.highlights.slice(0, 3).map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                          <CheckCircle2 size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200/80">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-500 border border-stone-200/80">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-5 flex items-center gap-2 text-sm font-medium text-emerald-800 group-hover:gap-2.5 transition-all">
                  <span>View Details</span>
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm touch-manipulation"
          onClick={() => setSelectedProject(null)}
        >
          <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className={`p-6 bg-gradient-to-r ${selectedProject.imageGradient || 'from-emerald-800 to-stone-800'} text-white relative overflow-hidden`}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/90 hover:text-white bg-stone-900/60 hover:bg-stone-900/90 rounded-full p-2 sm:p-2.5 transition-all z-30 cursor-pointer touch-manipulation"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <div className="relative z-10 pr-10 sm:pr-12">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-950/40 text-white backdrop-blur-md border border-white/20 inline-block mb-3">{selectedProject.categoryLabel}</span>
                <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-bold mb-1">{selectedProject.title}</h2>
                <p className="text-emerald-100 text-sm font-medium">{selectedProject.subtitle}</p>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              {selectedProject.imageUrlPreview && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Project Preview</h3>
                  <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-sm aspect-video w-full bg-stone-100">
                    {selectedProject.imageUrlPreview.endsWith('.mp4') || selectedProject.imageUrlPreview.endsWith('.webm') ? (
                      <video src={selectedProject.imageUrlPreview} autoPlay loop muted playsInline className="w-full h-full object-cover object-top" />
                    ) : (
                      <Image src={selectedProject.imageUrlPreview} alt={`${selectedProject.title} preview`} fill sizes="(max-width: 672px) 100vw, 672px" className="object-cover object-top" />
                    )}
                  </div>
                </div>
              )}
              <div><h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Overview</h3><p className="text-stone-700 text-base leading-relaxed">{selectedProject.detailedDescription || selectedProject.description}</p></div>
              {selectedProject.highlights && selectedProject.highlights.length > 0 && (<div><h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Key Technical Features</h3><ul className="space-y-2">{selectedProject.highlights.map((h, i) => (<li key={i} className="flex items-start gap-2.5 text-stone-700 text-sm"><CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" /><span>{h}</span></li>))}</ul></div>)}
              <div><h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Technologies & Concepts</h3><div className="flex flex-wrap gap-2">{selectedProject.techStack.map((tech) => (<span key={tech} className="text-xs font-semibold px-3 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200">{tech}</span>))}</div></div>
              <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedProject.githubUrl && (<a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-xs"><FaGithub size={16} />View Code</a>)}
                  {selectedProject.liveUrl && (<a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-xs"><ExternalLink size={16} />Live Site</a>)}
                </div>
                <button onClick={() => setSelectedProject(null)} className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
