"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, GraduationCap, Rocket, Brain } from "lucide-react";

const highlights = [
  {
    icon: <Briefcase size={20} className="text-indigo-400" />,
    title: "Full-Stack Engineer",
    desc: "Building end-to-end web applications with React, Next.js, Node.js, and modern databases.",
  },
  {
    icon: <Brain size={20} className="text-violet-400" />,
    title: "ML/AI Developer",
    desc: "Designing and deploying machine learning models and AI-powered systems with Python.",
  },
  {
    icon: <Rocket size={20} className="text-cyan-400" />,
    title: "Product-Minded",
    desc: "Focused on shipping production-ready software that solves real user problems.",
  },
  {
    icon: <GraduationCap size={20} className="text-emerald-400" />,
    title: "Continuous Learner",
    desc: "Always exploring new technologies, from LLMs to distributed systems architecture.",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="section-divider mb-16" />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Text */}
          <div>
            <p className="text-indigo-400 font-mono text-sm font-medium mb-3 tracking-wider">
              01. ABOUT ME
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Building at the intersection of{" "}
              <span className="gradient-text">software &amp; intelligence</span>
            </h2>
            <div className="space-y-4 text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <p>
                I&apos;m Michael Bassey, a Full-Stack Software Engineer and ML/AI
                Developer passionate about building systems that are both
                technically excellent and genuinely useful.
              </p>
              <p>
                My work spans the full product lifecycle — from crafting
                pixel-perfect React interfaces to architecting Node.js APIs,
                designing ML pipelines in Python, and deploying everything to
                the cloud.
              </p>
              <p>
                I&apos;m currently building{" "}
                <strong className="text-zinc-700 dark:text-zinc-300">Saita</strong>,
                an AI trading robot for synthetic indices and currency pairs, and{" "}
                <strong className="text-zinc-700 dark:text-zinc-300">Careal</strong>,
                a car license renewal and registration platform.
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-indigo-500/50 transition-all group"
              >
                <div className="mb-3 w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1 text-zinc-800 dark:text-zinc-200">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
