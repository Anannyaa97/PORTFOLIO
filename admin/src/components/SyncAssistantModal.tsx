import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
} from "lucide-react";
import { CODE_GS_SOURCE } from "../services/codeGsSource";
import {
  checkBackendSyncStatus,
  triggerDatabaseSeed,
  flushPendingSyncQueue,
  getPendingSyncQueue,
} from "../services/api";
import { useToast } from "../context/ToastContext";

interface SyncAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export const SyncAssistantModal: React.FC<SyncAssistantModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete,
}) => {
  const { success, error, info } = useToast();
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState<{
    connected: boolean;
    needsDeployment: boolean;
    spreadsheetId: string;
    error?: string;
  } | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPendingCount(getPendingSyncQueue().length);
      runCheck();
    }
  }, [isOpen]);

  const runCheck = async () => {
    setIsVerifying(true);
    try {
      const res = await checkBackendSyncStatus();
      setStatus(res);
      setPendingCount(getPendingSyncQueue().length);
    } catch (e: any) {
      setStatus({
        connected: false,
        needsDeployment: true,
        spreadsheetId: "1tKIt25bsAY6fJ5EOH1Mybqpcq6bVOpJD",
        error: e.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE_GS_SOURCE);
      setCopied(true);
      success("Code.gs Copied", "1,268 lines copied to your clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      error("Copy Failed", "Please manually copy backend/Code.gs from your workspace.");
    }
  };

  const handleVerifyAndSync = async () => {
    setIsVerifying(true);
    try {
      const checkRes = await checkBackendSyncStatus();
      setStatus(checkRes);

      if (checkRes.connected) {
        // Connected! Now seed database tables and flush pending sync queue
        info("Initializing Database", "Ensuring all 18 Google Sheets tabs exist...");
        await triggerDatabaseSeed();

        const flushRes = await flushPendingSyncQueue();
        setPendingCount(getPendingSyncQueue().length);

        success(
          "Database Synchronized",
          `Google Sheets connected! Synced ${flushRes.synced} staged records.`
        );

        if (onSyncComplete) onSyncComplete();
      } else {
        error(
          "Deployment Verification Pending",
          checkRes.error ||
            "Google Apps Script returned an authentication error. Please ensure you clicked 'Manage deployments > Edit > New version > Deploy'."
        );
      }
    } catch (err: any) {
      error("Verification Error", err.message || "Failed to connect to Apps Script");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#121215] border border-zinc-800 p-6 shadow-2xl shadow-black/90 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Google Sheets CMS Synchronization Hub
              </h3>
              <p className="text-xs text-zinc-400">
                Direct integration between Admin CMS, Google Apps Script, and Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Banner */}
        <div className="mt-4 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  status?.connected
                    ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                    : "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-pulse"
                }`}
              />
              <span className="text-xs font-semibold text-white">
                {status?.connected
                  ? "Google Sheets Connected & Verified"
                  : "Apps Script: Needs New Version Deployment"}
              </span>
            </div>

            <button
              onClick={runCheck}
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
              <span>{isVerifying ? "Testing..." : "Test Connection"}</span>
            </button>
          </div>

          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
            <div>
              <span className="text-zinc-500">Spreadsheet ID: </span>
              <span className="text-zinc-300 truncate">1tKIt25bsAY6fJ5EOH1Mybqpcq6bVOpJD</span>
            </div>
            <div>
              <span className="text-zinc-500">Sheets Owner: </span>
              <span className="text-zinc-300">anannyamalu23@gmail.com</span>
            </div>
            <div>
              <span className="text-zinc-500">Apps Script Account: </span>
              <span className="text-zinc-300">gamingwithjokers34@gmail.com</span>
            </div>
            <div>
              <span className="text-zinc-500">Pending Local Changes: </span>
              <span className={pendingCount > 0 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                {pendingCount} records staged
              </span>
            </div>
          </div>
        </div>

        {/* Action Steps */}
        <div className="mt-5 space-y-3.5">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
            How to Enable Instant Saving to Google Sheets:
          </div>

          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-white">Copy the Updated Backend Script</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Contains full CRUD handlers, Admin Key verification, and auto-seeding for all 18 database sheets.
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                copied
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20"
                  : "bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code.gs</span>
                </>
              )}
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-white">Paste into Google Apps Script Editor</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Open your Apps Script project (under <em>gamingwithjokers34@gmail.com</em>), select all in <code className="text-brand-300">Code.gs</code>, paste, and click <strong>Save</strong>.
              </p>
            </div>
            <a
              href="https://script.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
              <span>Open Apps Script</span>
            </a>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-white">Deploy as a New Version (Crucial!)</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                In Apps Script: Click <strong>Deploy</strong> ➔ <strong>Manage deployments</strong> ➔ Click the <strong>Pencil (Edit)</strong> icon ➔ In the <strong>Version</strong> dropdown, select <strong>New version</strong> ➔ Click <strong>Deploy</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-zinc-400">
            {pendingCount > 0 ? (
              <span className="text-amber-400 font-semibold">
                ⚠️ {pendingCount} modification(s) saved in local cache awaiting live sync.
              </span>
            ) : (
              <span className="text-zinc-500">
                All changes are safely staged in local CMS cache.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleVerifyAndSync}
              disabled={isVerifying}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(80,200,120,0.3)] disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
              <span>{isVerifying ? "Verifying..." : "Verify & Sync Now"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};