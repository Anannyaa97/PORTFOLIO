import React from "react";
import { getAssetUrl } from "@/lib/utils";
import { LiquidGlassCard } from "./kokonutui/liquid-glass-card";
import { 
  GraduationCap, 
  Award, 
  Languages, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  MapPin,
  BookOpen
} from "lucide-react";

export function About() {
  const profileImageUrl = getAssetUrl("profile/profile.jpeg");

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Background &amp; Profile
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          Academic Pulse &amp; Identity
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl">
          Deep-diving into computational algorithms, database engineering, and machine learning pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reference B - Profile Card */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="relative group w-full max-w-[380px] rounded-[32px] p-2 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#50C878]/25 via-[#0B6E4F]/20 to-[#013220]/30 rounded-[34px] blur-xl opacity-60 group-hover:opacity-100 transition duration-700 pointer-events-none" />

            {/* Inner Card Container */}
            <div className="relative rounded-[28px] overflow-hidden bg-[#121214] border border-white/10 flex flex-col">
              {/* Portrait Image with subtle zoom on hover */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-zinc-900">
                <img
                  src={profileImageUrl}
                  alt="Anannya AK - CSE Student specializing in Data Science"
                  className="w-full h-full object-cover object-center filter grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  onError={(e) => {
                    // Fallback if local image path fails to load
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />

                {/* Status pill badge on top */}
                <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-zinc-200">
                  <span className="w-2 h-2 rounded-full bg-[#50C878] animate-pulse" />
                  <span className="font-mono text-[11px]">Active CSE Student</span>
                </div>

                {/* Dark gradient overlay behind text */}
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />

                {/* Text near bottom with strong typography (Reference B) */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 text-left">
                  <div className="text-xs font-mono text-[#50C878] font-semibold tracking-wider uppercase mb-1">
                    B.Tech CSE (Data Science)
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight leading-tight">
                    ANANNYA AK
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1 flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#50C878]" />
                    Kannur, Kerala, India
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer Details */}
              <div className="p-5 bg-[#141417] border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Current Focus</span>
                  <span className="text-zinc-200 font-medium font-mono">Data Science &amp; Engineering</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Education</span>
                  <span className="text-[#50C878] font-medium font-mono">St. Thomas College of Engg.</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Cumulative CGPA</span>
                  <span className="text-[#50C878] font-semibold font-mono">8.6 / 10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Academic & Personal Information */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          {/* Bio Overview Panel with LiquidGlassCard */}
          <LiquidGlassCard glassEffect={true} className="p-6 sm:p-8">
            <h4 className="text-xl font-bold font-display text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#50C878]" />
              Professional Narrative
            </h4>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              I am a B.Tech student specializing in Computer Science and Engineering (Data Science). I thrive at the intersection of logical problem-solving and data-driven insights, with hands-on internship experience in software development, database migration, and Python-based data pipelines.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed mt-3">
              Passionate about architecting clean data infrastructures, applying machine learning algorithms (regression, classification, clustering, PCA), and writing robust code in Python, Java, SQL, and modern web environments.
            </p>
          </LiquidGlassCard>

          {/* Education Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Degree */}
            <div className="p-5 rounded-2xl bg-[#141416]/90 border border-white/10 hover:border-[#50C878]/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-[#0B6E4F]/20 text-[#50C878]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#50C878] font-medium bg-[#0B6E4F]/20 px-2 py-0.5 rounded-full border border-[#50C878]/30">
                    Expected 2028
                  </span>
                </div>
                <h5 className="font-display font-bold text-base text-white">
                  B.Tech in CSE (Data Science)
                </h5>
                <p className="text-xs text-zinc-400 mt-1 leading-snug">
                  St. Thomas College of Engineering and Technology, Kannur
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">Academic Standing</span>
                <span className="font-mono font-semibold text-[#50C878]">CGPA: 8.6 / 10</span>
              </div>
            </div>

            {/* School */}
            <div className="p-5 rounded-2xl bg-[#141416]/90 border border-white/10 hover:border-[#D1F2EB]/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-[#0B6E4F]/20 text-[#D1F2EB]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#D1F2EB] font-medium bg-[#0B6E4F]/20 px-2 py-0.5 rounded-full border border-[#D1F2EB]/30">
                    Higher Secondary
                  </span>
                </div>
                <h5 className="font-display font-bold text-base text-white">
                  Class XII — GHSS Chala
                </h5>
                <p className="text-xs text-zinc-400 mt-1 leading-snug">
                  Government Higher Secondary School, Chala, Kannur
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">Graduation Score</span>
                <span className="font-mono font-semibold text-[#D1F2EB]">95% Aggregate</span>
              </div>
            </div>
          </div>

          {/* Certifications Grid */}
          <div>
            <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#50C878]" />
              Verified Certifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#161619] border border-white/5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#50C878] shrink-0 mt-0.5" />
                <div>
                  <h6 className="text-sm font-semibold text-zinc-200">Python Training</h6>
                  <p className="text-xs text-zinc-400 mt-0.5">Spoken Tutorial, IIT Bombay (2025)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#161619] border border-white/5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D1F2EB] shrink-0 mt-0.5" />
                <div>
                  <h6 className="text-sm font-semibold text-zinc-200">Python for Data Science</h6>
                  <p className="text-xs text-zinc-400 mt-0.5">NPTEL Certification (2025)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Languages & Soft Skills */}
          <div>
            <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#50C878]" />
              Languages &amp; Core Strengths
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#161619] border-l-2 border-l-[#50C878] border border-white/5">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">Malayalam</span>
                <span className="text-sm font-semibold text-white">Native Speaker</span>
              </div>
              <div className="p-4 rounded-xl bg-[#161619] border-l-2 border-l-[#0B6E4F] border border-white/5">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">English</span>
                <span className="text-sm font-semibold text-white">Fluent Proficiency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
