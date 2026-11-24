import React, { useState, useEffect, useMemo, useRef } from "react";
import GooeyNav from "./GooeyNav";
import { getAssetUrl } from "@/lib/utils";
import { FileText, Menu, X } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioContext";

export function Navbar() {
  const { data } = usePortfolioData();
  const profile = data.profile;
  const resumeUrl = profile.resumeUrl?.startsWith("http")
    ? profile.resumeUrl
    : getAssetUrl(profile.resumeUrl || "resume.pdf");

  const navItems = useMemo(() => {
    return data.navigation && data.navigation.length > 0
      ? data.navigation.map((n) => ({ label: n.label, href: n.href }))
      : [
          { label: "Home", href: "#hero" },
          { label: "About", href: "#about" },
          { label: "Experience", href: "#experience" },
          { label: "Projects", href: "#projects" },
          { label: "Skills", href: "#skills" },
          { label: "Services", href: "#services" },
          { label: "Education", href: "#education" },
          { label: "Contact", href: "#contact" },
        ];
  }, [data.navigation]);

  const sectionIds = useMemo(() => {
    return navItems
      .map((item) => (item.href?.startsWith("#") ? item.href.slice(1) : ""))
      .filter(Boolean);
  }, [navItems]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Throttled ScrollSpy to keep active index synchronized with the user's scroll position
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      if (window.scrollY < 100) {
        setActiveIndex((prev) => (prev !== 0 ? 0 : prev));
        return;
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        const lastIdx = sectionIds.length - 1;
        setActiveIndex((prev) => (prev !== lastIdx ? lastIdx : prev));
        return;
      }

      const trigger = Math.max(180, window.innerHeight * 0.32);
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= trigger) {
            setActiveIndex((prev) => (prev !== i ? i : prev));
            break;
          }
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [sectionIds]);

  const scrollTo = (href: string, idx: number) => {
    setActiveIndex(idx);
    setIsMobileMenuOpen(false);

    // Temporarily pause scrollspy so smooth-scroll doesn't jitter intermediate tabs
    isProgrammaticScroll.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 850);

    if (href.startsWith("#")) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        if (window.location.hash !== href) {
          window.history.pushState(null, "", href);
        }
      }
    }
  };

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 mx-auto max-w-7xl pointer-events-none">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand logo on left */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#hero", 0);
          }}
          className="pointer-events-auto flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#111113]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group hover:border-[#50C878]/40 hover:shadow-[0_0_20px_rgba(80,200,120,0.2)] transition-all shrink-0"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#50C878] to-[#D1F2EB] p-[1.5px] transition-transform duration-300 group-hover:scale-110">
            <div className="w-full h-full rounded-full bg-[#013220] flex items-center justify-center font-bold text-[11px] text-[#50C878] font-display">
              AK
            </div>
          </div>
          <span className="font-display text-xs sm:text-sm font-bold text-white tracking-wider group-hover:text-[#50C878] transition-colors">
            {profile.name || "ANANNYA AK"}
          </span>
        </a>

        {/* Desktop Gooey Navigation: Clean, scroll-free flex container */}
        <div className="hidden lg:flex pointer-events-auto items-center justify-center overflow-visible">
          <GooeyNav
            items={navItems}
            activeIndex={activeIndex}
            onChange={(index, item) => {
              if (item?.href) {
                scrollTo(item.href, index);
              }
            }}
            theme="dark"
            color="#50C878"
            activeTextColor="#013220"
            size="md"
            frame={true}
            particleCount={12}
            spread={40}
            animationTime={380}
            timeVariance={100}
            gooeyness={0.45}
            wobble={0.35}
            hoverEffect={true}
            className="shadow-[0_10px_35px_rgba(1,50,32,0.45)]"
          />
        </div>

        {/* Right Action: Resume & Mobile Hamburger */}
        <div className="pointer-events-auto flex items-center gap-2">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#50C878] bg-[#0B6E4F]/20 border border-[#50C878]/30 hover:bg-[#50C878]/25 hover:border-[#50C878] hover:shadow-[0_0_20px_rgba(80,200,120,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>

          {/* Mobile / Tablet Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-[#111113]/90 backdrop-blur-xl border border-white/10 text-zinc-300 hover:text-white hover:border-[#50C878]/40 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#50C878]" /> : <Menu className="w-5 h-5 text-zinc-200" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu for < lg screens */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden mt-2 p-3 rounded-2xl bg-[#141416]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.href, idx);
                  }}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-[#50C878]/15 text-[#50C878] font-bold border border-[#50C878]/30 shadow-[inset_0_1px_2px_rgba(80,200,120,0.2)]"
                      : "text-zinc-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#50C878] shadow-[0_0_8px_rgba(80,200,120,0.8)] animate-pulse" />
                  )}
                </a>
              );
            })}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#50C878] bg-[#0B6E4F]/20 border border-[#50C878]/30"
            >
              <FileText className="w-4 h-4" />
              <span>View Resume ↗</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
