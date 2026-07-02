"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Bot, Car, Globe } from "lucide-react";

const GitHubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const projects = [
  {
    id: 1,
    title: "Saita",
    tagline: "AI Trading Robot",
    description:
      "An intelligent trading robot for synthetic indices and currency pairs. Features automated trade execution, risk management algorithms, real-time market analysis, and a cross-platform mobile and web interface.",
    tech: ["Python", "Machine Learning", "React Native", "Next.js", "Node.js", "WebSocket"],
    icon: <Bot size={24} />,
    color: "indigo",
    status: "In Development",
    github: "https://github.com/Slekie",
    live: null,
  },
  {
    id: 2,
    title: "Careal",
    tagline: "Car License Platform",
    description:
      "A full-stack platform that streamlines car license renewal and registration. Digitizes the entire process with document uploads, payment integration, status tracking, and government portal connectivity.",
    tech: ["Next.js", "Node.js", "Express", "PostgreSQL", "TypeScript", "REST API"],
    icon: <Car size={24} />,
    color: "violet",
    status: "In Development",
    github: "https://github.com/Slekie",
    live: null,
  },
  {
    id: 3,
    title: "This Portfolio",
    tagline: "Personal Portfolio Site",
    description:
      "A professional full-stack portfolio built with Next.js 16, TypeScript, Tailwind CSS 4, and Framer Motion. Features dark/light theme toggle, animated sections, resume download, and admin login system.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js"],
    icon: <Globe size={24} />,
    color: "cyan",
    status: "Live",
    github: "https://github.com/Slekie",
    live: "#",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/30 group-hover:border-indigo-500/60",
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/30 group-hover:border-violet-500/60",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30 group-hover:border-cyan-500/60",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
};

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
            <p className="text-indigo-400 font-mono text-sm font-medium mb-3 tracking-wider">
              03. PROJECTS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Things I&apos;ve built
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const c = colorMap[project.color];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`group relative flex flex-col p-6 rounded-2xl border bg-white dark:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 ${c.border}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}
                    >
                      {project.icon}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${c.badge}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                  <p className={`text-sm font-medium mb-3 ${c.text}`}>
                    {project.tagline}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono"
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
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
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
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:-translate-y-0.5"
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
