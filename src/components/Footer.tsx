import { Mail, FileText, ArrowUp, Sparkles } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "./icons";
import { getAssetUrl } from "@/lib/utils";

export function Footer() {
  const resumeUrl = getAssetUrl("resume.pdf");

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
              ANANNYA AK
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            B.Tech in CSE (Data Science) • Software Engineering
          </p>
        </div>

        {/* Compact Navigation Links */}
        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm font-medium mb-10"
        >
          <a
            href="#hero"
            className="text-zinc-400 hover:text-[#50C878] transition-colors"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-zinc-400 hover:text-[#50C878] transition-colors"
          >
            About
          </a>
          <a
            href="#experience"
            className="text-zinc-400 hover:text-[#50C878] transition-colors"
          >
            Experience
          </a>
          <a
            href="#projects"
            className="text-zinc-400 hover:text-[#50C878] transition-colors"
          >
            Projects
          </a>
          <a
            href="#skills"
            className="text-zinc-400 hover:text-[#50C878] transition-colors"
          >
            Skills
          </a>
          <a
            href="#contact"
            className="text-zinc-400 hover:text-[#50C878] transition-colors"
          >
            Contact
          </a>
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
            © 2026 Anannya AK. All rights reserved. Built with React &amp; Kokonut UI.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Anannyaa97"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-[#50C878]/40 hover:text-white transition-all"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/anannya-ak/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-[#50C878]/40 hover:text-white transition-all"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:anannyaak01@gmail.com"
              className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-[#50C878]/40 hover:text-white transition-all"
              aria-label="Send Email"
            >
              <Mail className="w-4 h-4" />
            </a>
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
