import React from "react";
import { Mail, FileText, ArrowUp } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "./icons";
import { getAssetUrl } from "@/lib/utils";
import { usePortfolioData } from "@/context/PortfolioContext";

export function Footer() {
  const { data } = usePortfolioData();
  const profile = data.profile;
  const resumeUrl = profile.resumeUrl?.startsWith("http")
    ? profile.resumeUrl
    : getAssetUrl(profile.resumeUrl || "resume.pdf");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#08080A]/85 backdrop-blur-md border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-zinc-400">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Top Centered Brand Identity */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#50C878] to-[#D1F2EB] p-[1.5px]">
              <div className="w-full h-full rounded-full bg-[#013220] flex items-center justify-center font-bold text-xs text-[#50C878] font-display">
                AK
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-bold font-display text-white tracking-wider">
              {profile.name || "ANANNYA AK"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            {profile.title || "B.Tech in CSE (Data Science) • Software Engineering"}
          </p>
        </div>

        {/* Compact Navigation Links */}
        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm font-medium mb-10"
        >
          {data.navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-zinc-400 hover:text-[#50C878] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#50C878] hover:text-[#D1F2EB] transition-colors font-mono"
          >
            Resume ↗
          </a>
        </nav>

        {/* Secondary Divider */}
        <div className="w-full max-w-5xl h-px bg-white/5 mb-8" />

        {/* Bottom Bar: Copyright on Left, Social Icons on Right */}
        <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="text-zinc-500 text-center sm:text-left">
            © {new Date().getFullYear()} {profile.name || "Anannya AK"}. All rights reserved. Built with React.
          </div>

          <div className="flex items-center gap-4">
            {data.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-[#50C878]/40 hover:text-white transition-all"
                aria-label={link.label || link.platform}
              >
                {link.platform.toLowerCase().includes("git") ? (
                  <Github className="w-4 h-4" />
                ) : link.platform.toLowerCase().includes("link") ? (
                  <Linkedin className="w-4 h-4" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
              </a>
            ))}

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-[#50C878]/40 hover:text-white transition-all"
              aria-label="View Resume PDF"
            >
              <FileText className="w-4 h-4" />
            </a>

            {/* Scroll to Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="ml-2 p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-[#50C878] hover:border-[#50C878]/40 hover:bg-white/10 transition-all"
              aria-label="Scroll back to top"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
