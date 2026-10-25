import React from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-[#50C878]/30 selection:text-[#D1F2EB]">
      {/* React Bits GooeyNav Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="main-content" className="relative z-10 flex flex-col">
        {/* Hero Section with Kokonut UI FlowField */}
        <Hero />

        {/* Continuous Grid Background Wrapper from About through Footer */}
        <div className="relative">
          {/* Architectural Developer Grid Layer */}
          <div
            className="absolute inset-0 bg-tech-grid grid-mask-fade pointer-events-none -z-10"
            aria-hidden="true"
          />

          {/* Ambient Lighting Spots for Visual Depth (Curated Palette: #0B6E4F, #50C878, #013220) */}
          <div
            className="absolute top-24 left-1/4 w-[500px] h-[500px] bg-[#0B6E4F]/[0.08] rounded-full blur-[140px] pointer-events-none -z-10"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#50C878]/[0.05] rounded-full blur-[160px] pointer-events-none -z-10"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-48 left-1/3 w-[500px] h-[500px] bg-[#013220]/[0.15] rounded-full blur-[150px] pointer-events-none -z-10"
            aria-hidden="true"
          />

          {/* About Section */}
          <About />

          {/* Experience Section */}
          <Experience />

          {/* Projects Section (Reference A 6-card grid with Live Demos) */}
          <Projects />

          {/* Skills Section */}
          <Skills />

          {/* Contact Section */}
          <Contact />

          {/* Footer (Reference C) */}
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;
