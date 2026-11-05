import React from "react";
import { Menu, Sun, Moon, ExternalLink, ShieldCheck, Database, RefreshCw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getAppsScriptUrl } from "../services/api";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenSyncModal?: () => void;
  pendingSyncCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
  onRefresh,
  isRefreshing = false,
  onOpenSyncModal,
  pendingSyncCount = 0,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isConnected = !!getAppsScriptUrl();

  const handleOpenLiveSite = () => {
    // Open the public portfolio
    window.open("https://anannya-ak.onrender.com", "_blank");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-800/80 bg-[#0d0d10]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile trigger & Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-zinc-400 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right: Status, Refresh, Theme, Preview, Profile */}
      <div className="flex items-center gap-3">
        {/* Backend Connectivity / Sync Hub Trigger */}
        <button
          onClick={onOpenSyncModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all hover:scale-[1.02] ${
            pendingSyncCount > 0
              ? "bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
              : isConnected
              ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
          title="Open Google Sheets Synchronization Hub"
        >
          <Database className={`w-3.5 h-3.5 ${pendingSyncCount > 0 ? "text-amber-400 animate-pulse" : "text-brand-400"}`} />
          <span>
            {pendingSyncCount > 0
              ? `${pendingSyncCount} Staged (Sync Sheets)`
              : isConnected
              ? "Google Sheets Hub"
              : "Sheets Disconnected"}
          </span>
        </button>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Data from Sheets"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-400" : ""}`} />
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Live Portfolio Preview Button */}
        <button
          onClick={handleOpenLiveSite}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-400 hover:bg-brand-500/20 hover:border-brand-500/50 transition-all shadow-[0_0_15px_rgba(80,200,120,0.12)]"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-zinc-200 truncate max-w-[120px]">
              {user?.name || "Anannya AK"}
            </div>
            <div className="text-[10px] text-brand-400 font-mono">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};
