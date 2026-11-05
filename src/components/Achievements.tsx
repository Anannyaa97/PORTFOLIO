import React from "react";
import { Trophy, Award, Calendar, Sparkles } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioContext";

export function Achievements() {
  const { data } = usePortfolioData();
  const achievements = data.achievements || [];

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono tracking-wider uppercase mb-3">
          <Trophy className="w-3.5 h-3.5" />
          Honors &amp; Recognitions
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Academic &amp; Technical Honors
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-6 rounded-3xl bg-[#141416] border border-white/10 hover:border-[#50C878]/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#50C878]" />
                  <span>{ach.date}</span>
                </span>
              </div>

              <h3 className="text-base font-bold font-display text-white mb-2">
                {ach.title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {ach.description}
              </p>
            </div>

            {ach.associatedEvent && (
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-[#50C878]">
                {ach.associatedEvent}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Achievements;

