"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Bot, Car, Globe } from "lucide-react";

const GitHubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const colors = {
  indigo: { accent: "#4f46e5", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)", borderHover: "rgba(99,102,241,0.6)" },
  violet: { accent: "#7c3aed", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)", borderHover: "rgba(139,92,246,0.6)" },
  cyan:   { accent: "#0e7490", bg: "rgba(6,182,212,0.08)",  border: "rgba(6,182,212,0.25)",  borderHover: "rgba(6,182,212,0.6)"  },
};

const projects = [
  {
    id: 1,
    title: "Saita",
    tagline: "AI Trading Robot",
    description: "An intelligent trading robot for synthetic indices and currency pairs. Features automated trade execution, risk management algorithms, real-time market analysis, and a cross-platform mobile and web interface.",
    tech: ["Python", "Machine Learning", "React Native", "Next.js", "Node.js", "WebSocket"],
    icon: <Bot size={24} />,
    color: "indigo" as const,
    status: "In Development",
    github: "https://github.com/Slekie",
    live: null,
  },
  {
    id: 2,
    title: "Careal",
    tagline: "Car License Platform",
    description: "A full-stack platform that streamlines car license renewal and registration. Digitizes the entire process with document uploads, payment integration, status tracking, and government portal connectivity.",
    tech: ["Next.js", "Node.js", "Express", "PostgreSQL", "TypeScript", "REST API"],
    icon: <Car size={24} />,
    color: "violet" as const,
    status: "In Development",
    github: "https://github.com/Slekie",
    live: null,
  },
  {
    id: 3,
    title: "This Portfolio",
    tagline: "Personal Portfolio Site",
    description: "A professional full-stack portfolio built with Next.js 16, TypeScript, Tailwind CSS 4, and Framer Motion. Features dark/light theme toggle, animated sections, resume download, and admin login system.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js"],
    icon: <Globe size={24} />,
    color: "cyan" as const,
    status: "Live",
    github: "https://github.com/Slekie",
    live: "#",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="section-divider mb-16" />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-14">
            <p className="section-label mb-3 tracking-wider block">03. PROJECTS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
              Things I&apos;ve built
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const c = colors[project.color];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group relative flex flex-col p-6 rounded-2xl border bg-white dark:bg-zinc-900 transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: c.border }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = c.borderHover)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: c.bg, color: c.accent }}
                    >
                      {project.icon}
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium border"
                      style={{ background: c.bg, color: c.accent, borderColor: c.border }}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-1 text-zinc-900 dark:text-white">{project.title}</h3>
                  <p className="text-sm font-medium mb-3" style={{ color: c.accent }}>{project.tagline}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} GitHub`}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <GitHubIcon size={14} />
                        Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live demo`}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* More on GitHub */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <a
              href="https://github.com/Slekie"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:-translate-y-0.5"
            >
              <GitHubIcon size={16} />
              More on GitHub
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
