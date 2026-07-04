"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    label: "Frontend",
    color: { light: "#4f46e5", dark: "#818cf8", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)" },
    skills: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js"],
  },
  {
    label: "Backend",
    color: { light: "#7c3aed", dark: "#a78bfa", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
    skills: ["Node.js", "Express.js", "REST APIs", "PostgreSQL", "MongoDB"],
  },
  {
    label: "ML / AI",
    color: { light: "#0e7490", dark: "#22d3ee", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)" },
    skills: ["Python", "Machine Learning", "Deep Learning", "Data Analysis", "AI Systems"],
  },
  {
    label: "Tools & DevOps",
    color: { light: "#059669", dark: "#34d399", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
    skills: ["Git", "GitHub", "VS Code", "Vercel", "Docker (learning)"],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="section-divider mb-16" />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-14">
            <p className="section-label mb-3 tracking-wider block">02. SKILLS</p>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
              Technologies I work with
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-500/40 transition-all"
              >
                <h3
                  className="font-mono text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: cat.color.light }}
                >
                  {cat.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border cursor-default transition-colors"
                      style={{
                        background: cat.color.bg,
                        borderColor: cat.color.border,
                        color: cat.color.light,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
