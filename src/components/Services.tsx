import React from "react";
import { Sparkles, Database, Code, LineChart, Cpu, Terminal, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioContext";

export function Services() {
  const { data } = usePortfolioData();
  const services = data.services || [];

  if (services.length === 0) return null;

  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case "database":
        return <Database className="w-5 h-5 text-[#50C878]" />;
      case "linechart":
      case "analytics":
        return <LineChart className="w-5 h-5 text-[#D1F2EB]" />;
      case "terminal":
        return <Terminal className="w-5 h-5 text-[#50C878]" />;
      case "cpu":
        return <Cpu className="w-5 h-5 text-[#D1F2EB]" />;
      case "code":
      default:
        return <Code className="w-5 h-5 text-[#50C878]" />;
    }
  };

  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Technical Offerings
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          Services &amp; Technical Capabilities
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl">
          Architectural data pipelines, predictive intelligence models, and modern full-stack web platforms engineered for reliability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="group flex flex-col justify-between p-7 rounded-3xl bg-[#141416] border border-white/10 hover:border-[#50C878]/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(80,200,120,0.1)] relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#0B6E4F]/20 border border-[#50C878]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(srv.iconName)}
                </div>
                <span className="text-xs font-mono text-zinc-500">Service 0{srv.order || 1}</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white group-hover:text-[#D1F2EB] transition-colors mb-3">
                {srv.title}
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                {srv.description}
              </p>
            </div>

            {srv.deliverables && srv.deliverables.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Key Deliverables:
                </div>
                <div className="space-y-1.5">
                  {srv.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#50C878] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;

