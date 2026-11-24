import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Services } from "./components/Services";
import { Education } from "./components/Education";
import { Achievements } from "./components/Achievements";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { MusicPlayer } from "./components/MusicPlayer";
import { PortfolioProvider, usePortfolioData } from "./context/PortfolioContext";
import { Disc3, X, RefreshCw } from "lucide-react";

function PortfolioMain() {
  const { data, isSyncing, refetch } = usePortfolioData();
  const appearance = data.appearance;
  const [isMusicWidgetOpen, setIsMusicWidgetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-[#50C878]/30 selection:text-[#D1F2EB] relative overflow-x-hidden">
      {/* Sticky Real-Time Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="main-content" className="relative z-10 flex flex-col">
        {/* Hero Section */}
        {appearance.showHero !== false && <Hero />}

        {/* Continuous Grid Background Wrapper */}
        <div className="relative">
          {/* Architectural Developer Grid Layer */}
          <div
            className="absolute inset-0 bg-tech-grid grid-mask-fade pointer-events-none -z-10"
            aria-hidden="true"
          />

          {/* Ambient Lighting Spots for Visual Depth (GPU-accelerated and optimized blur radii) */}
          <div
            className="absolute top-24 left-1/4 w-[450px] h-[450px] bg-[#0B6E4F]/[0.08] rounded-full blur-[80px] pointer-events-none -z-10 will-change-transform"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-[#50C878]/[0.05] rounded-full blur-[90px] pointer-events-none -z-10 will-change-transform"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-48 left-1/3 w-[450px] h-[450px] bg-[#013220]/[0.15] rounded-full blur-[80px] pointer-events-none -z-10 will-change-transform"
            aria-hidden="true"
          />

          {/* About Section */}
          {appearance.showAbout !== false && <About />}

          {/* Experience Section */}
          {appearance.showExperience !== false && <Experience />}

          {/* Projects Section */}
          {appearance.showProjects !== false && <Projects />}

          {/* Skills Section */}
          {appearance.showSkills !== false && <Skills />}

          {/* Services Section */}
          {appearance.showServices !== false && <Services />}

          {/* Education & Certificates Section */}
          {(appearance.showEducation !== false || appearance.showCertificates !== false) && (
            <Education />
          )}

          {/* Achievements Section */}
          {appearance.showAchievements !== false && <Achievements />}

          {/* Contact Section */}
          {appearance.showContact !== false && <Contact />}

          {/* Footer */}
          <Footer />
        </div>
      </main>

      {/* Optional Interactive Music Player Hub */}
      {appearance.showMusicPlayer !== false && (
        <aside aria-label="Audio player hub">
          {/* Floating trigger widget button */}
          <button
            type="button"
            onClick={() => setIsMusicWidgetOpen(!isMusicWidgetOpen)}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#121214]/90 border border-[#50C878]/40 text-[#50C878] shadow-[0_0_20px_rgba(80,200,120,0.3)] hover:scale-110 active:scale-95 transition-all backdrop-blur-xl group"
            aria-label="Toggle background audio player"
            title="Focus Soundscapes"
          >
            {isMusicWidgetOpen ? (
              <X className="w-5 h-5 text-zinc-300" />
            ) : (
              <Disc3 className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
            )}
          </button>

          {/* Expandable Music Player Window */}
          {isMusicWidgetOpen && (
            <div className="fixed bottom-20 right-6 z-40 w-[92vw] sm:w-[380px] animate-fade-in shadow-2xl">
              <MusicPlayer />
            </div>
          )}
        </aside>
      )}

      {/* Discreet Live Refresh Indicator when syncing */}
      {isSyncing && (
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-[#50C878]/30 backdrop-blur-md text-[11px] font-mono text-[#50C878] animate-fade-in pointer-events-none">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Syncing Database...</span>
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <PortfolioProvider>
      <PortfolioMain />
    </PortfolioProvider>
  );
}

export default App;
