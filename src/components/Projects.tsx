import React from "react";
import { 
  FolderGit2, 
  ExternalLink, 
  Database, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Globe, 
  Activity,
  Server,
  Code2
} from "lucide-react";
import { GithubIcon as Github } from "./icons";
import { usePortfolioData } from "@/context/PortfolioContext";

function ProjectVisualPreview({
  type,
  thumbnailUrl,
  title,
  category,
}: {
  type: string;
  thumbnailUrl?: string;
  title: string;
  category: string;
}) {
  if (thumbnailUrl && thumbnailUrl.trim()) {
    return (
      <div className="w-full h-44 bg-zinc-900 border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    );
  }

  switch (type) {
    case "chart":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#14261e] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-[#50C878] font-mono">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> High-Throughput Analytics
            </span>
            <span className="bg-[#0B6E4F]/30 px-2 py-0.5 rounded text-[10px] text-[#D1F2EB]">Distributed Pipeline</span>
          </div>
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
            <span>Aggregated Metrics</span>
            <span>Live Stream</span>
          </div>
        </div>
      );

    case "terminal":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#14231b] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-[#50C878] font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Security &amp; Heuristics
            </span>
            <span className="w-2 h-2 rounded-full bg-[#50C878] animate-pulse" />
          </div>
          <div className="p-2.5 rounded-lg bg-black/50 font-mono text-[11px] text-zinc-300 space-y-1">
            <div className="text-zinc-500">$ inspect --target payload.io</div>
            <div className="text-[#50C878] font-semibold">✓ Heuristic Validation: Complete</div>
            <div className="text-zinc-400">Risk Assessment: 0-100 Engine Active</div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Explainable Scoring</span>
            <span>Pattern Recognition</span>
          </div>
        </div>
      );

    case "hotel":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#1b2520] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-[#50C878] font-mono">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Software Architecture
            </span>
            <span className="bg-[#0B6E4F]/20 px-2 py-0.5 rounded text-[10px] text-[#D1F2EB]">ACID Relational</span>
          </div>
          <div className="grid grid-cols-3 gap-2 my-auto">
            <div className="p-2 rounded bg-black/40 border border-white/5 text-center">
              <div className="text-xs text-[#50C878] font-bold font-mono">100%</div>
              <div className="text-[9px] text-zinc-400 font-mono">Data Sync</div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 text-center">
              <div className="text-xs text-[#50C878] font-bold font-mono">Atomic</div>
              <div className="text-[9px] text-zinc-400 font-mono">Transactions</div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 text-center">
              <div className="text-xs text-[#50C878] font-bold font-mono">OOP</div>
              <div className="text-[9px] text-zinc-400 font-mono">Design</div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Persistent Storage</span>
            <span>Relational Engine</span>
          </div>
        </div>
      );

    case "hardware":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#13221b] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-[#50C878] font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Systems &amp; Hardware
            </span>
            <span className="bg-[#0B6E4F]/20 px-2 py-0.5 rounded text-[10px] text-[#D1F2EB]">Microarchitecture</span>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-300 flex items-center justify-around my-auto">
            <div className="text-center">
              <div className="text-xs text-[#50C878] font-bold">L1 Split</div>
              <div className="text-[9px] text-zinc-500">I-Cache / D-Cache</div>
            </div>
            <div className="text-zinc-600 font-bold">vs</div>
            <div className="text-center">
              <div className="text-xs text-[#D1F2EB] font-bold">Unified</div>
              <div className="text-[9px] text-zinc-500">Shared Bus</div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Cycle-Accurate</span>
            <span>Miss Ratio Benchmark</span>
          </div>
        </div>
      );

    case "migration":
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#14231f] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-[#50C878] font-mono">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Database Pipeline
            </span>
            <span className="bg-[#0B6E4F]/20 px-2 py-0.5 rounded text-[10px] text-[#D1F2EB]">Automated Transformation</span>
          </div>
          <div className="flex items-center justify-center gap-4 my-auto">
            <div className="p-2 rounded bg-black/40 border border-white/5 text-center">
              <Database className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-[10px] font-mono text-zinc-300">Source</div>
            </div>
            <div className="text-[#50C878] font-mono text-xs">──▶──▶</div>
            <div className="p-2 rounded bg-black/40 border border-white/5 text-center">
              <Database className="w-4 h-4 text-teal-400 mx-auto mb-1" />
              <div className="text-[10px] font-mono text-zinc-300">Target</div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Schema Validation</span>
            <span>100% Integrity</span>
          </div>
        </div>
      );

    case "web":
    default:
      return (
        <div className="w-full h-44 bg-gradient-to-b from-[#132219] to-[#121214] p-4 flex flex-col justify-between rounded-t-2xl border-b border-white/5 relative overflow-hidden group-hover:brightness-110 transition-all">
          <div className="flex items-center justify-between text-xs text-[#50C878] font-mono">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Modern Web Platform
            </span>
            <span className="bg-[#0B6E4F]/20 px-2 py-0.5 rounded text-[10px] text-[#D1F2EB]">Full-Stack App</span>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-center my-auto">
            <div className="text-xs font-bold font-mono text-white flex items-center justify-center gap-2">
              <Code2 className="w-4 h-4 text-[#50C878]" />
              <span>{category || "Software Engineering"}</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1">High-Performance Architecture</div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Responsive Architecture</span>
            <span>Production Ready</span>
          </div>
        </div>
      );
  }
}

export function Projects() {
  const { data } = usePortfolioData();
  const projects = data.projects;

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
          Authentic, verified projects across distributed data pipelines, heuristic security engines, systems architecture, and web platforms.
        </p>
      </div>

      {/* Dynamic responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col rounded-3xl bg-[#141416] border border-white/10 hover:border-[#50C878]/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(80,200,120,0.12)] overflow-hidden"
          >
            {/* Visual preview at top of each card */}
            <ProjectVisualPreview
              type={project.visualType || "chart"}
              thumbnailUrl={project.thumbnailUrl}
              title={project.title}
              category={project.category}
            />

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between text-xs text-[#50C878] font-mono mb-2">
                  <span>{project.category}</span>
                  {project.statValue && (
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {project.statValue}
                    </span>
                  )}
                </div>

                {/* White Heading */}
                <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-[#D1F2EB] transition-colors leading-snug mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                  {project.description}
                </p>
              </div>

              <div>
                {/* Technology Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(project.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/[0.04] border border-white/[0.08] text-zinc-300 group-hover:border-[#50C878]/30 group-hover:text-[#D1F2EB] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card Action Links */}
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
