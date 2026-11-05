import React from "react";
import { GraduationCap, Award, ExternalLink, Calendar, BookOpen, CheckCircle2 } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioContext";

export function Education() {
  const { data } = usePortfolioData();
  const educationList = data.education || [];
  const certList = data.certificates || [];

  return (
    <section id="education" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono tracking-wider uppercase mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          Academic Foundation
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          Education &amp; Certifications
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl">
          Formal academic training in Computer Science &amp; Data Science complemented by accredited technical credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Formal Degrees */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#50C878]" />
            <span>Academic Milestones</span>
          </h3>

          <div className="space-y-4">
            {educationList.map((edu) => (
              <div
                key={edu.id}
                className="p-6 sm:p-7 rounded-3xl bg-[#141416] border border-white/10 hover:border-[#50C878]/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 w-fit">
                    <Calendar className="w-3.5 h-3.5 text-[#50C878]" />
                    <span>{edu.period}</span>
                  </div>
                  {edu.grade && (
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#0B6E4F]/20 text-[#50C878] border border-[#50C878]/30 font-bold w-fit">
                      {edu.grade}
                    </span>
                  )}
                </div>

                <h4 className="text-lg sm:text-xl font-bold font-display text-white mb-1">
                  {edu.degree} in {edu.field}
                </h4>

                <p className="text-sm text-zinc-400 font-medium mb-3">
                  {edu.institution}
                </p>

                {edu.description && (
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-3 border-t border-white/5">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Accredited Certifications */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[#50C878]" />
            <span>Verified Certifications</span>
          </h3>

          <div className="space-y-4">
            {certList.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-[#141416] border border-white/10 hover:border-[#50C878]/30 transition-all group flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0B6E4F]/20 border border-[#50C878]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5 text-[#50C878]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white group-hover:text-[#D1F2EB] transition-colors leading-snug">
                      {cert.title}
                    </h5>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {cert.issuer}
                    </p>
                    <span className="text-[11px] font-mono text-zinc-500 mt-1 inline-block">
                      Issued {cert.issueYear}
                    </span>
                  </div>
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-[#50C878] transition-colors shrink-0"
                    title="Verify Credential"
                    aria-label={`Verify ${cert.title}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;

