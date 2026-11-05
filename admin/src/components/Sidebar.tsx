import React, { useState } from "react";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Wrench,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Sparkles,
  MessageSquare,
  FileText,
  Globe,
  Image as ImageIcon,
  Music,
  Compass,
  Share2,
  Mail,
  Sliders,
  ExternalLink,
  History,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  FileCheck,
} from "lucide-react";

export type AdminSection =
  | "dashboard"
  | "profile"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certificates"
  | "achievements"
  | "services"
  | "testimonials"
  | "resume"
  | "seo"
  | "media-images"
  | "media-documents"
  | "media-audio"
  | "navigation"
  | "social-links"
  | "contact"
  | "music-player"
  | "appearance"
  | "preview"
  | "activity-log"
  | "settings";

interface SidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  onLogout,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const [portfolioOpen, setPortfolioOpen] = useState(true);
  const [mediaOpen, setMediaOpen] = useState(true);
  const [websiteOpen, setWebsiteOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(true);

  const handleNav = (section: AdminSection) => {
    onSelectSection(section);
    setIsMobileOpen(false);
  };

  const navItemClass = (active: boolean) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
      active
        ? "bg-brand-500/15 text-brand-400 font-semibold border border-brand-500/30 shadow-[0_0_15px_rgba(80,200,120,0.15)]"
        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
    }`;

  const groupHeaderClass =
    "flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer select-none";

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d0d10] border-r border-zinc-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 p-0.5 shadow-[0_0_15px_rgba(80,200,120,0.3)]">
              <div className="w-full h-full rounded-[10px] bg-zinc-950 flex items-center justify-center font-bold text-xs text-brand-400 font-display">
                AK
              </div>
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>PORTFOLIO CMS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Google Sheets CMS</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* Dashboard Direct */}
          <div>
            <button
              onClick={() => handleNav("dashboard")}
              className={`w-full ${navItemClass(currentSection === "dashboard")}`}
            >
              <LayoutDashboard className="w-4 h-4 text-brand-400" />
              <span>Dashboard Overview</span>
            </button>
          </div>

          {/* Group: Portfolio Content */}
          <div className="space-y-1">
            <div
              className={groupHeaderClass}
              onClick={() => setPortfolioOpen(!portfolioOpen)}
            >
              <span className="flex items-center gap-1.5 font-semibold">Portfolio Content</span>
              {portfolioOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>

            {portfolioOpen && (
              <div className="space-y-0.5 pt-1 pl-2 border-l border-zinc-800/80 ml-2">
                <button
                  onClick={() => handleNav("profile")}
                  className={`w-full ${navItemClass(currentSection === "profile")}`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Hero</span>
                </button>
                <button
                  onClick={() => handleNav("about")}
                  className={`w-full ${navItemClass(currentSection === "about")}`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>About Section</span>
                </button>
                <button
                  onClick={() => handleNav("skills")}
                  className={`w-full ${navItemClass(currentSection === "skills")}`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Skills &amp; Stack</span>
                </button>
                <button
                  onClick={() => handleNav("projects")}
                  className={`w-full ${navItemClass(currentSection === "projects")}`}
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Projects Showcase</span>
                </button>
                <button
                  onClick={() => handleNav("experience")}
                  className={`w-full ${navItemClass(currentSection === "experience")}`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Experience &amp; Internships</span>
                </button>
                <button
                  onClick={() => handleNav("education")}
                  className={`w-full ${navItemClass(currentSection === "education")}`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Education</span>
                </button>
                <button
                  onClick={() => handleNav("certificates")}
                  className={`w-full ${navItemClass(currentSection === "certificates")}`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certifications</span>
                </button>
                <button
                  onClick={() => handleNav("achievements")}
                  className={`w-full ${navItemClass(currentSection === "achievements")}`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Achievements</span>
                </button>
                <button
                  onClick={() => handleNav("services")}
                  className={`w-full ${navItemClass(currentSection === "services")}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Services &amp; Deliverables</span>
                </button>
                <button
                  onClick={() => handleNav("testimonials")}
                  className={`w-full ${navItemClass(currentSection === "testimonials")}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Testimonials</span>
                </button>
                <button
                  onClick={() => handleNav("resume")}
                  className={`w-full ${navItemClass(currentSection === "resume")}`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Resume &amp; CV</span>
                </button>
              </div>
            )}
          </div>

          {/* Group: Media Manager */}
          <div className="space-y-1">
            <div
              className={groupHeaderClass}
              onClick={() => setMediaOpen(!mediaOpen)}
            >
              <span className="flex items-center gap-1.5 font-semibold">Media Manager</span>
              {mediaOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>

            {mediaOpen && (
              <div className="space-y-0.5 pt-1 pl-2 border-l border-zinc-800/80 ml-2">
                <button
                  onClick={() => handleNav("media-images")}
                  className={`w-full ${navItemClass(currentSection === "media-images")}`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Images</span>
                </button>
                <button
                  onClick={() => handleNav("media-documents")}
                  className={`w-full ${navItemClass(currentSection === "media-documents")}`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Documents</span>
                </button>
                <button
                  onClick={() => handleNav("media-audio")}
                  className={`w-full ${navItemClass(currentSection === "media-audio")}`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Audio Soundscapes</span>
                </button>
              </div>
            )}
          </div>

          {/* Group: Website Settings & SEO */}
          <div className="space-y-1">
            <div
              className={groupHeaderClass}
              onClick={() => setWebsiteOpen(!websiteOpen)}
            >
              <span className="flex items-center gap-1.5 font-semibold">Site &amp; Settings</span>
              {websiteOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>

            {websiteOpen && (
              <div className="space-y-0.5 pt-1 pl-2 border-l border-zinc-800/80 ml-2">
                <button
                  onClick={() => handleNav("navigation")}
                  className={`w-full ${navItemClass(currentSection === "navigation")}`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Navigation Structure</span>
                </button>
                <button
                  onClick={() => handleNav("social-links")}
                  className={`w-full ${navItemClass(currentSection === "social-links")}`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Social Links</span>
                </button>
                <button
                  onClick={() => handleNav("contact")}
                  className={`w-full ${navItemClass(currentSection === "contact")}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Channels</span>
                </button>
                <button
                  onClick={() => handleNav("music-player")}
                  className={`w-full ${navItemClass(currentSection === "music-player")}`}
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Music Player Hub</span>
                </button>
                <button
                  onClick={() => handleNav("appearance")}
                  className={`w-full ${navItemClass(currentSection === "appearance")}`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Appearance &amp; Toggles</span>
                </button>
                <button
                  onClick={() => handleNav("seo")}
                  className={`w-full ${navItemClass(currentSection === "seo")}`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>SEO &amp; GEO Optimization</span>
                </button>
              </div>
            )}
          </div>

          {/* Group: System */}
          <div className="space-y-1">
            <div
              className={groupHeaderClass}
              onClick={() => setSystemOpen(!systemOpen)}
            >
              <span className="flex items-center gap-1.5 font-semibold">System</span>
              {systemOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>

            {systemOpen && (
              <div className="space-y-0.5 pt-1 pl-2 border-l border-zinc-800/80 ml-2">
                <button
                  onClick={() => handleNav("preview")}
                  className={`w-full ${navItemClass(currentSection === "preview")}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Website</span>
                </button>
                <button
                  onClick={() => handleNav("activity-log")}
                  className={`w-full ${navItemClass(currentSection === "activity-log")}`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Activity Log</span>
                </button>
                <button
                  onClick={() => handleNav("settings")}
                  className={`w-full ${navItemClass(currentSection === "settings")}`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Database &amp; API Keys</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer: User & Logout */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Security Guard</span>
          </button>
        </div>
      </aside>
    </>
  );
};
