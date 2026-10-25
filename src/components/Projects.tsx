import React from "react";
import { LiquidGlassCard } from "./kokonutui/liquid-glass-card";
import { 
  FolderGit2, 
  ExternalLink, 
  Database, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Globe, 
  Activity,
  Server
} from "lucide-react";
import { GithubIcon as Github } from "./icons";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  visualType: "chart" | "terminal" | "hotel" | "hardware" | "web" | "migration";
  stats?: { label: string; value: string };
}

const PROJECTS: ProjectItem[] = [
  {
    id: "hospital-analysis",
    title: "Hospital Patient Record Analysis",
    category: "Big Data & Distributed Computing",
    description: "Distributed big data pipeline processing New York State inpatient discharge records using HDFS and PySpark for high-throughput cleansing and exploratory analytics, presented in a custom live analytics dashboard.",
    technologies: ["PySpark", "HDFS", "Python", "Big Data", "HTML5", "Chart.js"],
    githubUrl: "https://github.com/Anannyaa97/Hospital-Patient-Analysis",
    liveUrl: "https://hospital-patient-analysis.onrender.com",
    featured: true,
    visualType: "chart",
    stats: { label: "Engine", value: "PySpark + HDFS" },
  },
  {
    id: "cybersentry",
    title: "CyberSentry: Phishing Analyzer",
    category: "Security & Heuristic Intelligence",
    description: "Explainable URL security analysis engine that inspects text patterns and computes transparent 0–100 heuristic risk scores, identifying threat vectors rather than relying on opaque classifications.",
    technologies: ["Python", "Heuristic Analysis", "Cybersecurity", "Risk Scoring"],
    githubUrl: "https://github.com/Anannyaa97/CyberSentry",
    liveUrl: "https://cybersentry-skx7.onrender.com",
    visualType: "terminal",
    stats: { label: "Heuristics", value: "0-100 Risk Engine" },
  },
  {
    id: "hotel-booking",
    title: "Hotel Room Booking System",
    category: "Software Engineering & Database",
    description: "Full-featured reservation system developed with Java Swing for user interaction and MySQL with JDBC for persistent storage, handling room bookings, payment tracking, and customer reviews.",
    technologies: ["Java Swing", "MySQL", "JDBC", "OOP Architecture"],
    githubUrl: "https://github.com/Anannyaa97/Hotel-Room-Booking-System",
    visualType: "hotel",
    stats: { label: "Storage", value: "MySQL ACID" },
  },
  {
    id: "riscv-cache",
    title: "Unified vs Split Cache RISC-V Analysis",
    category: "Computer Architecture",
    description: "Comprehensive benchmark comparing Unified and Split Cache memory architectures executing RISC-V assembly routines on the Ripes simulator to evaluate cycle times, miss ratios, and stalls.",
    technologies: ["RISC-V Assembly", "Ripes Simulator", "Architecture Benchmarking"],
    githubUrl: "https://github.com/Anannyaa97/Unified-vs-Split-Cache-RISC-V",
    visualType: "hardware",
    stats: { label: "Platform", value: "RISC-V ISA" },
  },
  {
    id: "ieee-website",
    title: "IEEE Student Branch Portal",
    category: "Full Stack & Web Technologies",
    description: "Official interactive web platform created for the IEEE Student Branch, serving event registrations, organizational updates, technical committee directories, and workshop schedules.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git"],
    githubUrl: "https://github.com/Anannyaa97/IEEE-WEBSITE",
    liveUrl: "https://anannyaa97.github.io/IEEE-WEBSITE/",
    visualType: "web",
    stats: { label: "Status", value: "Live Deployment" },
  },
  {
    id: "db-migration",
    title: "Database Migration Engine",
    category: "Enterprise Infrastructure",
    description: "Automated database migration framework developed at Dinesh IT Systems for seamless data transformation between MySQL and PostgreSQL with schema validation and complete SRS documentation.",
    technologies: ["Python", "PostgreSQL", "MySQL", "SRS Documentation", "Validation"],
    githubUrl: "https://github.com/Anannyaa97",
    visualType: "migration",
    stats: { label: "Scope", value: "Dinesh IT Systems" },
  },
];

function ProjectVisualPreview({ type }: { type: ProjectItem["visualType"] }) {
  switch (type) {
    case "chart":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#14261e] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-[#50C878] font-mono">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> PySpark Analytics
            </span>
            <span className="bg-[#0B6E4F]/30 px-2 py-0.5 rounded text-[10px] text-[#D1F2EB]">NY Inpatient Records</span>
          </div>
          {/* Simulated Mini Chart Bars */}
          <div className="flex items-end justify-between gap-1.5 h-20 pt-2 px-2">
            {[45, 75, 30, 90, 60, 85, 40, 100, 70, 80].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  style={{ height: `${val}%` }}
                  className="w-full rounded-t bg-gradient-to-t from-[#0B6E4F]/60 to-[#50C878] group-hover:from-[#50C878] group-hover:to-[#D1F2EB] transition-all duration-500"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Discharge Cohorts</span>
            <span>HDFS Distributed</span>
          </div>
        </div>
      );

    case "terminal":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#14231b] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-[#50C878] font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> CyberSentry CLI
            </span>
            <span className="w-2 h-2 rounded-full bg-[#50C878] animate-pulse" />
          </div>
          <div className="p-2.5 rounded-lg bg-black/50 font-mono text-[11px] text-zinc-300 space-y-1">
            <div className="text-zinc-500">$ cybersentry scan --url target.site</div>
            <div className="text-[#50C878] font-semibold">✓ Entropy Analysis: Validated</div>
            <div className="text-zinc-400">Risk Score: 14/100 (Clean Protocol)</div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Explainable Scoring</span>
            <span>Heuristic Engine</span>
          </div>
        </div>
      );

    case "hotel":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#261f18] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Java Swing + MySQL
            </span>
            <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[10px] text-amber-300">ACID Relational</span>
          </div>
          <div className="grid grid-cols-3 gap-2 my-auto">
            <div className="p-2 rounded bg-black/40 border border-white/5 text-center">
              <div className="text-xs text-amber-400 font-bold font-mono">100%</div>
              <div className="text-[9px] text-zinc-400 font-mono">Booking Sync</div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 text-center">
              <div className="text-xs text-amber-400 font-bold font-mono">JDBC</div>
              <div className="text-[9px] text-zinc-400 font-mono">Connection</div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 text-center">
              <div className="text-xs text-amber-400 font-bold font-mono">Secure</div>
              <div className="text-[9px] text-zinc-400 font-mono">Transaction</div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Reservation Engine</span>
            <span>MySQL Backend</span>
          </div>
        </div>
      );

    case "hardware":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#221829] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-purple-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> RISC-V Benchmark
            </span>
            <span className="bg-purple-500/20 px-2 py-0.5 rounded text-[10px] text-purple-300">Ripes Sim</span>
          </div>
          <div className="p-2 rounded bg-black/40 font-mono text-[10px] space-y-1 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Unified Cache:</span>
              <span className="text-purple-300 font-semibold">Higher Miss / Contention</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Split L1 (I/D):</span>
              <span className="text-[#50C878] font-semibold">+28% Throughput</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Assembly Instructions</span>
            <span>Microarchitecture</span>
          </div>
        </div>
      );

    case "web":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#16202c] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-sky-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> IEEE Branch Portal
            </span>
            <span className="bg-sky-500/20 px-2 py-0.5 rounded text-[10px] text-sky-300">Live Website</span>
          </div>
          <div className="p-2 rounded bg-black/50 border border-sky-500/20 text-center my-auto">
            <span className="text-xs font-mono text-white font-medium block">Interactive Student Community</span>
            <span className="text-[10px] text-sky-300 font-mono">Event Schedules &amp; Directories</span>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Responsive Web</span>
            <span>anannyaa97.github.io</span>
          </div>
        </div>
      );

    case "migration":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#14261e] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-[#50C878] font-mono">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Schema Transformation
            </span>
            <span className="bg-[#0B6E4F]/30 px-2 py-0.5 rounded text-[10px] text-[#D1F2EB]">Dinesh IT Systems</span>
          </div>
          <div className="flex items-center justify-around my-auto">
            <div className="px-2.5 py-1.5 rounded bg-black/50 border border-white/10 text-center font-mono text-xs text-zinc-300">
              MySQL
            </div>
            <span className="text-[#50C878] font-mono text-sm">➔ ETL ➔</span>
            <div className="px-2.5 py-1.5 rounded bg-black/50 border border-white/10 text-center font-mono text-xs text-[#D1F2EB] font-semibold">
              PostgreSQL
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Automated Validation</span>
            <span>SRS Specification</span>
          </div>
        </div>
      );
  }
}

export function Projects() {
  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono tracking-wider uppercase mb-3">
          <FolderGit2 className="w-3.5 h-3.5" />
          Featured Engineering Portfolio
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          Featured Engineering Projects
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl">
          Six authentic, verified projects across distributed data pipelines, heuristic security engines, systems architecture, and web platforms.
        </p>
      </div>

      {/* Three-column desktop grid, charcoal cards, rounded corners, preview at top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col rounded-3xl bg-[#141416] border border-white/10 hover:border-[#50C878]/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(80,200,120,0.12)] overflow-hidden"
          >
            {/* Visual preview at top of each card */}
            <ProjectVisualPreview type={project.visualType} />

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between text-xs text-[#50C878] font-mono mb-2">
                  <span>{project.category}</span>
                  {project.stats && (
                    <span className="text-[11px] text-zinc-500">
                      {project.stats.value}
                    </span>
                  )}
                </div>

                {/* White Heading */}
                <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-[#D1F2EB] transition-colors leading-snug mb-3">
                  {project.title}
                </h3>

                {/* Muted Gray Description */}
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Technology Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/[0.04] border border-white/[0.08] text-zinc-300 group-hover:border-[#50C878]/30 group-hover:text-[#D1F2EB] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card Action Links: GitHub & Live Demo */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-[#D1F2EB] transition-colors"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#50C878] hover:text-[#D1F2EB] font-semibold transition-colors"
                      aria-label={`Open live demo for ${project.title}`}
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
