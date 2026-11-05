import React, { useState, useEffect } from "react";
import GooeyNav, { GooeyNavItem } from "./reactbits/GooeyNav";
import { getAssetUrl } from "@/lib/utils";
import { FileText } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioContext";

export function Navbar() {
  const { data } = usePortfolioData();
  const profile = data.profile;
  const resumeUrl = profile.resumeUrl?.startsWith("http")
    ? profile.resumeUrl
    : getAssetUrl(profile.resumeUrl || "resume.pdf");

  const navItems: GooeyNavItem[] = (data.navigation && data.navigation.length > 0)
    ? data.navigation.map((n) => ({ label: n.label, href: n.href }))
    : [
        { label: "Home", href: "#hero" },
        { label: "About", href: "#about" },
        { label: "Experience", href: "#experience" },
        { label: "Projects", href: "#projects" },
        { label: "Skills", href: "#skills" },
        { label: "Contact", href: "#contact" },
      ];

  const sectionIds = navItems
    .map((item) => (item.href?.startsWith("#") ? item.href.slice(1) : ""))
    .filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);

  // ScrollSpy to keep active index synchronized with the user's scroll position
  useEffect(() => {
    const handleScroll = () => {
      // When near the top of the page, activate Home (index 0)
      if (window.scrollY < 120) {
        setActiveIndex(0);
        return;
      }

      // Check if user is near the bottom of the page -> activate Contact (last item)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveIndex(sectionIds.length - 1);
        return;
      }

      // Trigger line in viewport (35% from top of screen, min 200px)
      const trigger = Math.max(200, window.innerHeight * 0.35);
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= trigger) {
            setActiveIndex(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  const handleNavClick = (idx: number, item: GooeyNavItem) => {
    setActiveIndex(idx);
    if (item.href?.startsWith("#")) {
      const target = document.getElementById(item.href.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        if (window.location.hash !== item.href) {
          window.history.pushState(null, "", item.href);
        }
      }
    }
  };

  return (
    <header className="fixed top-2 sm:top-5 left-0 right-0 z-50 flex items-center justify-center sm:justify-between px-2 sm:px-6 py-1 sm:py-2 mx-auto max-w-6xl transition-all pointer-events-none">
      {/* Brand logo on left */}
      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="hidden sm:flex pointer-events-auto items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111113]/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group hover:border-[#50C878]/40 transition-all shrink-0"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#50C878] to-[#D1F2EB] p-[1.5px] transition-transform duration-300 group-hover:scale-105">
          <div className="w-full h-full rounded-full bg-[#013220] flex items-center justify-center font-bold text-xs text-[#50C878] font-display">
            AK
          </div>
        </div>
        <span className="hidden md:inline font-display text-xs sm:text-sm font-bold text-white tracking-wider group-hover:text-[#50C878] transition-colors">
          {profile.name || "ANANNYA AK"}
        </span>
      </a>

      {/* Main GooeyNav Centered */}
      <div className="pointer-events-auto flex items-center justify-center">
        <GooeyNav
          items={navItems}
          activeIndex={activeIndex}
          onChange={handleNavClick}
          theme="dark"
          color="#50C878"
          activeTextColor="#013220"
          colors={["#50C878", "#D1F2EB", "#0B6E4F"]}
          size="md"
          frame={true}
          particleCount={10}
          spread={8}
          animationTime={260}
          timeVariance={60}
          gooeyness={0.42}
          hoverEffect={true}
          className="shadow-[0_10px_35px_rgba(1,50,32,0.45)]"
        />
      </div>

      {/* Action on right: Resume button */}
      <div className="hidden sm:flex pointer-events-auto shrink-0 items-center">
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-[#50C878] bg-[#0B6E4F]/20 border border-[#50C878]/30 hover:bg-[#50C878]/20 hover:border-[#50C878] hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(80,200,120,0.18)]"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resume</span>
        </a>
      </div>
    </header>
  );
}

export default Navbar;
