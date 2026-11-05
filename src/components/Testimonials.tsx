import React from "react";
import { MessageSquare, Star, Quote } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioContext";

export function Testimonials() {
  const { data } = usePortfolioData();
  const testimonials = data.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono tracking-wider uppercase mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          Endorsements
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          Recommendations &amp; Feedback
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl">
          Observations and endorsements from academic supervisors, engineering mentors, and project collaborators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between p-7 rounded-3xl bg-[#141416] border border-white/10 hover:border-[#50C878]/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(80,200,120,0.1)] relative"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <Quote className="w-8 h-8 text-[#50C878]/40" />
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed italic mb-8">
                "{t.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 flex items-center justify-center text-[#50C878] font-bold font-mono text-xs overflow-hidden shrink-0">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                ) : (
                  t.clientName.substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {t.clientName}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {t.clientRole} {t.company ? `• ${t.company}` : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;

