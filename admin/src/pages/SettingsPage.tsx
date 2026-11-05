import React, { useState } from "react";
import { getAppsScriptUrl, setAppsScriptUrl, apiCall, INITIAL_DATA } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import {
  Settings,
  Database,
  CheckCircle2,
  AlertCircle,
  Key,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Save,
} from "lucide-react";

interface SettingsPageProps {
  onRefreshAllData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onRefreshAllData }) => {
  const [appsScriptUrl, setUrlState] = useState(getAppsScriptUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const { success, error } = useToast();

  const handleSaveUrl = () => {
    setAppsScriptUrl(appsScriptUrl);
    success("Configuration Saved", "Apps Script endpoint URL updated in local configuration.");
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Save current url first
    setAppsScriptUrl(appsScriptUrl);

    try {
      const res = await apiCall("portfolio", "GET");
      setIsTesting(false);
      if (res.success && res.data) {
        setTestResult({
          success: true,
          message: "Connection verified! Successfully retrieved live data from Google Sheets & Apps Script.",
        });
        success("Connected", "Successfully reached Apps Script Web App.");
        onRefreshAllData();
      } else {
        setTestResult({
          success: false,
          message: res.error || "Backend reached but returned an error response.",
        });
        error("Connection Issue", res.error || "Backend responded with error");
      }
    } catch (err: any) {
      setIsTesting(false);
      setTestResult({
        success: false,
        message: err.message || "Network error. Please verify the Web App deployment URL and permissions.",
      });
      error("Connection Failed", "Could not reach endpoint. Check CORS and deployment URL.");
    }
  };

  const handleSeedDatabase = async () => {
    try {
      const res = await apiCall("seedDatabase", "POST");
      if (res.success) {
        success("Database Seeded", "Google Sheets initialized with verified portfolio content.");
        onRefreshAllData();
      } else {
        error("Seed Failed", res.error || "Could not seed Google Sheets directly.");
      }
    } catch (e: any) {
      error("Seed Request Failed", e.message);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem("portfolio_cms_local_store");
    onRefreshAllData();
    setIsResetConfirmOpen(false);
    success("Data Reset", "Database re-seeded with verified portfolio content.");
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">System Settings &amp; API Keys</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure Google Apps Script backend routing, OAuth credentials, and database synchronization.
          </p>
        </div>
      </div>

      {/* Section 1: Google Apps Script Web App Configuration */}
      <div className="rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Google Apps Script Web App Endpoint
          </h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Paste the deployed Google Apps Script Web App URL (`https://script.google.com/macros/s/.../exec`). If left blank, the admin operates on local verified mock storage.
        </p>

        <div className="space-y-3">
          <input
            type="url"
            value={appsScriptUrl}
            onChange={(e) => setUrlState(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycb.../exec"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveUrl}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Endpoint</span>
            </button>

            <button
              onClick={handleTestConnection}
              disabled={isTesting || !appsScriptUrl.trim()}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin text-brand-400" : ""}`} />
              <span>{isTesting ? "Testing..." : "Test Connection"}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-mono flex items-start gap-2.5 mt-2 ${
                testResult.success
                  ? "bg-brand-500/10 border-brand-500/30 text-brand-300"
                  : "bg-red-500/10 border-red-500/30 text-red-300"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Security & Administrator Allowlist */}
      <div className="rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Security &amp; Administrator Allowlist
          </h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Write operations are verified on the server by Google OAuth token verification and administrator allowlist validation.
        </p>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="text-xs text-zinc-400 font-mono">Authorized Administrator Accounts:</div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 font-mono text-xs font-semibold">
              anannyamalu23@gmail.com (Sheets &amp; Drive)
            </span>
            <span className="px-3 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 font-mono text-xs font-semibold">
              gamingwithjokers34@gmail.com (Apps Script)
            </span>
            <span className="px-3 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 font-mono text-xs font-semibold">
              anannyaak01@gmail.com (Portfolio)
            </span>
          </div>
          <div className="text-[11px] text-zinc-500">
            Connected Database Spreadsheet ID: <code className="text-zinc-300">1tKIt25bsAY6fJ5EOH1Mybqpcq6bVOpJD</code><br />
            Connected Google Drive Media Folder ID: <code className="text-zinc-300">1tdwIhAH6WevW6PuXBH4abNqkYevlN7Z8</code>
          </div>
        </div>
      </div>

      {/* Section 3: Database Initialization & Seeding */}
      <div className="rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Database Re-sync &amp; Google Sheets Initialization
          </h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Populate all 15 sheets in Google Sheets with verified initial portfolio records, or reset local browser cache.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSeedDatabase}
            className="px-4 py-2 rounded-xl bg-brand-500/20 border border-brand-500/30 text-brand-400 hover:bg-brand-500/30 text-xs font-semibold transition-all shadow-sm"
          >
            Seed / Populate Google Sheets Database
          </button>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-all"
          >
            Reset Local Browser Cache
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset Portfolio Data"
        message="This will reset your local browser cache to the initial 6 verified projects, skills, profile, and about content. Are you sure?"
        confirmLabel="Reset Data"
        onConfirm={handleResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
