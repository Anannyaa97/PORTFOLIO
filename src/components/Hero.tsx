import React from "react";
import { FlowField } from "./kokonutui/flow-field";
import { Button } from "./ui/button";
import { getAssetUrl } from "@/lib/utils";
import { 
  FileText, 
  Mail, 
  ArrowRight, 
  Sparkles,
  Database,
  Code2,
  Cpu
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "./icons";

export function Hero() {
  const resumeUrl = getAssetUrl("resume.pdf");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0A0A] scroll-mt-24"
    >
      {/* FlowField background canvas animation */}
      <div className="absolute inset-0 pointer-events-auto">
        <FlowField density={0.8} speed={0.9} interactive={true} className="w-full h-full opacity-60" />
      </div>

      {/* Subtle radial ambient gradients to enhance contrast without blocking flow field */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#0B6E4F]/15 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-[#013220]/30 rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* Main hero content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:border-[#50C878]/40 transition-colors animate-fade-in shadow-[0_0_20px_rgba(80,200,120,0.12)] max-w-[92vw]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#50C878] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#50C878]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-mono font-medium tracking-wider uppercase text-zinc-300 truncate">
            CSE Student — Data Science Specialization
          </span>
        </div>

        {/* Name Title */}
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold font-display tracking-tight text-white mb-6 leading-[1.1]">
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-[#D1F2EB] via-[#50C878] to-white bg-clip-text text-transparent">
            Anannya AK
          </span>
        </h1>

        {/* Subtitle / Positioning */}
        <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 font-display font-medium max-w-3xl mb-6 leading-snug">
          Data Science &amp; <span className="text-[#50C878]">Software Engineering</span>
        </p>

        {/* Professional summary text */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed font-normal">
          Building high-performance ecosystems at the intersection of logical problem-solving and data-driven insights. Hands-on experience in distributed big data pipelines, machine learning, and secure database architectures.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12 w-full max-w-md sm:max-w-none">
          <a href="#projects" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#50C878] to-[#0B6E4F] hover:from-[#50C878] hover:to-[#50C878] text-[#013220] font-bold shadow-[0_0_25px_rgba(80,200,120,0.35)] hover:shadow-[0_0_35px_rgba(80,200,120,0.5)] transition-all rounded-xl"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>

          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#50C878]/40 text-white rounded-xl backdrop-blur-md"
            >
              <FileText className="w-4 h-4 text-[#50C878]" />
              View Resume
            </Button>
          </a>

          <a href="#contact" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto gap-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl"
            >
              <Mail className="w-4 h-4" />
              Contact Me
            </Button>
          </a>
        </div>

        {/* Highlights Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-10 text-left">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0B6E4F]/20 text-[#50C878]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Specialization</div>
              <div className="text-sm font-medium text-zinc-200">Data Science &amp; ML</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0B6E4F]/20 text-[#D1F2EB]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Academic Score</div>
              <div className="text-sm font-medium text-zinc-200">CGPA: 8.6 / 10</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#013220]/40 text-[#50C878]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono">Industry Experience</div>
              <div className="text-sm font-medium text-zinc-200">2 Internships</div>
            </div>
          </div>
        </div>

        {/* Social Links Bar */}
        <div className="flex items-center gap-4 text-zinc-400">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Connect:</span>
          <a
            href="https://github.com/Anannyaa97"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#50C878] hover:text-[#D1F2EB] hover:scale-110 active:scale-95 transition-all"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/anannya-ak/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#50C878] hover:text-[#D1F2EB] hover:scale-110 active:scale-95 transition-all"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="mailto:anannyaak01@gmail.com"
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#50C878] hover:text-[#D1F2EB] hover:scale-110 active:scale-95 transition-all"
            aria-label="Send Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
