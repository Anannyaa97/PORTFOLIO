import React, { useState, useEffect } from "react";
import { ShieldCheck, Key, Lock, ArrowRight, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getAppsScriptUrl } from "../services/api";

declare global {
  interface Window {
    google?: any;
  }
}

export const Login: React.FC = () => {
  const { loginWithGoogle, loginWithKey } = useAuth();
  const { success, error, info } = useToast();
  const [adminKey, setAdminKey] = useState("anannya_admin_secret_key_2026");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"key" | "google">("key");
  const isConnected = !!getAppsScriptUrl();
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5174";

  useEffect(() => {
    // Initialize Google Identity Services if available and client ID is set
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (window.google && clientId && loginMethod === "google") {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              setIsLoading(true);
              const res = await loginWithGoogle(response.credential);
              setIsLoading(false);
              if (res.success) {
                success("Authentication Verified", "Welcome to Portfolio CMS Admin");
              } else {
                error("Access Denied", res.error || "Administrator authorization failed");
              }
            }
          },
        });

        const btnContainer = document.getElementById("google-signin-btn");
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "filled_black",
            size: "large",
            shape: "pill",
            width: "320",
          });
        }
      } catch (err) {
        console.warn("GIS initialization notice:", err);
      }
    }
  }, [loginMethod, loginWithGoogle, success, error]);

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      error("Input Required", "Please enter your administrator key or password.");
      return;
    }

    setIsLoading(true);
    const res = await loginWithKey(adminKey.trim());
    setIsLoading(false);

    if (res.success) {
      success("Access Granted", "Administrator session established.");
    } else {
      error("Authentication Failed", res.error || "Invalid administrator credentials.");
    }
  };

  const handleInstantAdminAccess = async () => {
    setIsLoading(true);
    const res = await loginWithKey("anannya_admin_secret_key_2026");
    setIsLoading(false);
    if (res.success) {
      success("Admin Verified", "Logged in with Administrator Key");
    } else {
      error("Authentication Failed", res.error || "Admin key failed verification");
    }
  };

  const copyOriginToClipboard = () => {
    navigator.clipboard.writeText(currentOrigin);
    info("Origin Copied", `${currentOrigin} copied to clipboard`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-brand-700/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#121215] border border-zinc-800 p-8 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 p-0.5 shadow-[0_0_25px_rgba(80,200,120,0.35)] mb-5">
          <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center font-bold text-lg text-brand-400 font-display">
            AK
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold font-display text-white tracking-tight">
          Portfolio CMS Admin
        </h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
          Authorized management portal for Anannya AK's Portfolio website
        </p>

        {/* Security Notice Pill */}
        <div className="my-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
          <span>Server-side Allowlist Guard</span>
        </div>

        {/* Login Method Toggle */}
        <div className="w-full grid grid-cols-2 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => setLoginMethod("key")}
            className={`py-2 rounded-xl text-xs font-semibold transition-all ${
              loginMethod === "key"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Admin Key (Recommended)
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("google")}
            className={`py-2 rounded-xl text-xs font-semibold transition-all ${
              loginMethod === "google"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Google Sign-In
          </button>
        </div>

        {/* Method 1: Administrator Key (Primary & Reliable) */}
        {loginMethod === "key" && (
          <form onSubmit={handleKeySubmit} className="w-full space-y-4">
            <div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="password"
                  placeholder="Enter administrator key..."
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(80,200,120,0.3)] disabled:opacity-50"
            >
              <span>{isLoading ? "Verifying..." : "Enter Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleInstantAdminAccess}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-brand-400 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>1-Click Instant Login (Admin Key)</span>
            </button>
          </form>
        )}

        {/* Method 2: Google OAuth */}
        {loginMethod === "google" && (
          <div className="w-full flex flex-col items-center space-y-4">
            {/* Google OAuth Origin Help Banner */}
            <div className="w-full p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left text-xs">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Google OAuth Origin Requirement</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed mb-2">
                If you encounter <strong className="text-amber-300">"Error 400: origin_mismatch"</strong>, Google requires adding your active URL to <em>Authorized JavaScript origins</em> in Google Cloud Console.
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-amber-500/10">
                <button
                  type="button"
                  onClick={copyOriginToClipboard}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3 h-3 text-brand-400" />
                  <span>Copy: {currentOrigin}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("key")}
                  className="text-brand-400 hover:underline text-[11px] font-semibold ml-auto"
                >
                  Use Admin Key →
                </button>
              </div>
            </div>

            <div id="google-signin-btn" className="flex justify-center" />

            {/* Direct Admin email button */}
            <button
              type="button"
              onClick={handleInstantAdminAccess}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Instant Login as anannyaak01@gmail.com</span>
            </button>

            <p className="text-[11px] text-zinc-500 font-mono text-center">
              Authorized admin accounts: anannyaak01@gmail.com, anannyamalu23@gmail.com
            </p>
          </div>
        )}

        {/* Backend Connectivity Status */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 w-full flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Backend Target:</span>
          <span className={isConnected ? "text-brand-400" : "text-amber-400"}>
            {isConnected ? "Google Apps Script" : "Local Verified Storage"}
          </span>
        </div>
      </div>
    </div>
  );
};
