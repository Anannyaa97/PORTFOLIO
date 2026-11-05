import React from "react";
import { Briefcase, Calendar, Terminal, Database } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioContext";

export function Experience() {
  const { data } = usePortfolioData();
  const experiences = data.experience;

  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono tracking-wider uppercase mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          Professional Path
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          Internship Experience
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl">
          Real-world industry internships in software architecture, database migrations, and predictive data engineering.
        </p>
      </div>

      {/* Experience Cards */}
      <div className="space-y-8 relative">
        {/* Subtle vertical spine for desktop */}
        <div className="hidden md:block absolute left-8 top-6 bottom-6 w-px bg-gradient-to-b from-[#50C878]/40 via-[#0B6E4F]/30 to-transparent pointer-events-none" />

        {experiences.map((item) => (
          <div
            key={item.id || item.company}
            className="relative md:pl-20 group transition-all duration-300"
          >
            {/* Timeline node icon */}
            <div className="hidden md:flex absolute left-4 top-6 -translate-x-1/2 w-9 h-9 rounded-full bg-[#121214] border border-white/20 items-center justify-center group-hover:scale-110 group-hover:border-[#50C878] transition-all z-10 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
              {item.iconName === "Database" ? (
                <Database className="w-5 h-5 text-[#D1F2EB]" />
              ) : (
                <Terminal className="w-5 h-5 text-[#50C878]" />
              )}
            </div>

            {/* Experience Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#141416]/90 border border-white/10 hover:border-[#50C878]/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(80,200,120,0.08)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#50C878] font-semibold">
                      {item.company}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {item.role}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 self-start sm:self-center">
                  <Calendar className="w-3.5 h-3.5 text-[#50C878]" />
                  {item.period}
                </div>
              </div>

              {/* Responsibilities list */}
              <ul className="space-y-3 mb-6 text-sm sm:text-base text-zinc-300">
                {(item.description || []).map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#50C878] mt-2 shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>

              {/* Technologies Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(item.technologies || []).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-mono rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:border-[#50C878]/40 hover:text-[#D1F2EB] transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experience;
