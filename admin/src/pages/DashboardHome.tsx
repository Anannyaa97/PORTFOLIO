import React from "react";
import {
  FolderGit2,
  Wrench,
  Award,
  Briefcase,
  Image as ImageIcon,
  Clock,
  PlusCircle,
  ExternalLink,
  Upload,
  User,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  Radio,
  Sparkles,
  MessageSquare,
  FileCheck,
  Globe,
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { DashboardStats, ActivityLogItem } from "../types";
import { AdminSection } from "../components/Sidebar";

interface DashboardHomeProps {
  stats: DashboardStats;
  onNavigate: (section: AdminSection) => void;
  onOpenSyncModal?: () => void;
  pendingSyncCount?: number;
}

export function DashboardHome({
  stats,
  onNavigate,
  onOpenSyncModal,
  pendingSyncCount = 0,
}: DashboardHomeProps) {
  const formattedLastUpdated = stats.lastUpdated
    ? new Date(stats.lastUpdated).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Just now";

  const isConnected = stats.dbConnected !== false;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cloud Sync Alert Banner if not fully deployed */}
      {(!isConnected || pendingSyncCount > 0) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-black/40">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Google Sheets Live Synchronization Notice</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {pendingSyncCount > 0 ? `${pendingSyncCount} Changes Staged` : "Action Recommended"}
                </span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                Changes saved through this Admin panel are safely preserved in your persistent CMS cache. To sync them directly to your live Google Sheet (<code>1tKIt25bsAY6fJ5EOH1Mybqpcq6bVOpJD</code>), deploy the updated <code>backend/Code.gs</code> version in Apps Script.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSyncModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-md shadow-amber-500/20"
          >
            <span>Open Sync Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-zinc-900 via-zinc-900 to-[#121b16] border border-zinc-800 shadow-xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Google Sheets Database Active</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono ${
              isConnected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}>
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{isConnected ? "API Synchronized" : "Re-sync Needed"}</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight leading-tight">
            Welcome, Anannya AK
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
            Manage, publish, and synchronize your personal portfolio content dynamically across Google Sheets, Google Drive, and your public website.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate("projects")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Project</span>
          </button>
          <button
            onClick={() => onNavigate("media-images")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-all border border-zinc-700"
          >
            <Upload className="w-4 h-4 text-brand-400" />
            <span>Upload Media</span>
          </button>
          <button
            onClick={() => onNavigate("preview")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium text-xs transition-all border border-zinc-800"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-400" />
            <span>System &amp; Database Metrics</span>
          </h3>
          <span className="text-xs font-mono text-zinc-500">
            Last Synced: <span className="text-zinc-300">{formattedLastUpdated}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Projects"
            value={stats.totalProjects}
            subtitle={`${stats.publishedProjects} Published`}
            icon={FolderGit2}
            badge={`${stats.publishedProjects}/${stats.totalProjects} Published`}
            badgeColor="brand"
            onClick={() => onNavigate("projects")}
          />
          <StatCard
            title="Skills"
            value={stats.totalSkills}
            subtitle="Verified Stack"
            icon={Wrench}
            badge="Technical Stack"
            badgeColor="sky"
            onClick={() => onNavigate("skills")}
          />
          <StatCard
            title="Experience"
            value={stats.totalExperience}
            subtitle="Industry Roles"
            icon={Briefcase}
            badge="Internships"
            badgeColor="brand"
            onClick={() => onNavigate("experience")}
          />
          <StatCard
            title="Certificates"
            value={stats.totalCertificates}
            subtitle="Verified Credentials"
            icon={Award}
            badge="IIT & NPTEL"
            badgeColor="purple"
            onClick={() => onNavigate("certificates")}
          />
          <StatCard
            title="Media Assets"
            value={stats.totalMedia}
            subtitle="Google Drive Synced"
            icon={ImageIcon}
            badge="Cloud Files"
            badgeColor="amber"
            onClick={() => onNavigate("media-images")}
          />
          <StatCard
            title="Sync Status"
            value={isConnected ? "Online" : "Cached"}
            subtitle="Google Sheets"
            icon={Clock}
            badge={isConnected ? "100% Synced" : "Offline"}
            badgeColor={isConnected ? "brand" : "amber"}
            onClick={() => onNavigate("settings")}
          />
        </div>
      </div>

      {/* Middle Section: Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-400">
            Content Modules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate("profile")}
              className="p-4 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-brand-500/50 text-left transition-all group flex items-start justify-between"
            >
              <div>
                <div className="p-2 rounded-xl bg-zinc-900 text-brand-400 w-fit mb-2">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  Profile &amp; Bio
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Hero, CGPA, Headline</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate("skills")}
              className="p-4 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-brand-500/50 text-left transition-all group flex items-start justify-between"
            >
              <div>
                <div className="p-2 rounded-xl bg-zinc-900 text-sky-400 w-fit mb-2">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  Skills &amp; Stack
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Proficiency &amp; Reorder</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate("services")}
              className="p-4 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-brand-500/50 text-left transition-all group flex items-start justify-between"
            >
              <div>
                <div className="p-2 rounded-xl bg-zinc-900 text-emerald-400 w-fit mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Services
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">ETL, ML &amp; Web Engg</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate("testimonials")}
              className="p-4 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-brand-500/50 text-left transition-all group flex items-start justify-between"
            >
              <div>
                <div className="p-2 rounded-xl bg-zinc-900 text-amber-400 w-fit mb-2">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Testimonials
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Peer &amp; Mentor Quotes</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate("resume")}
              className="p-4 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-brand-500/50 text-left transition-all group flex items-start justify-between"
            >
              <div>
                <div className="p-2 rounded-xl bg-zinc-900 text-teal-400 w-fit mb-2">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                  Resume &amp; CV
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Drive PDF Management</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigate("seo")}
              className="p-4 rounded-2xl bg-[#141417] border border-zinc-800 hover:border-brand-500/50 text-left transition-all group flex items-start justify-between"
            >
              <div>
                <div className="p-2 rounded-xl bg-zinc-900 text-indigo-400 w-fit mb-2">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  SEO &amp; GEO
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Metadata &amp; JSON-LD</div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

        {/* Audit Log / Activity Trail */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-400">
              Recent Modifications &amp; Audit Trail
            </h3>
            <button
              onClick={() => onNavigate("activity-log")}
              className="text-xs text-brand-400 hover:text-brand-300 font-mono hover:underline"
            >
              View Full Log →
            </button>
          </div>

          <div className="rounded-2xl bg-[#141417] border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.slice(0, 5).map((log: ActivityLogItem, idx: number) => (
                <div key={log.id || idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        log.status === "SUCCESS"
                          ? "bg-brand-400"
                          : log.status === "FAILURE"
                          ? "bg-red-400"
                          : "bg-amber-400"
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
                          {log.action}
                        </span>
                        <span>{log.entity}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{log.details}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                No recent activity recorded. Modifying content creates audit records.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
