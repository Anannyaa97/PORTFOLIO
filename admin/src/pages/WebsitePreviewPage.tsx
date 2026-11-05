import React, { useState } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw, Link2 } from "lucide-react";

export const WebsitePreviewPage: React.FC = () => {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [key, setKey] = useState(0);

  // Automatically detect if running locally (port 5173) or production
  const defaultLocalUrl =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5173"
      : "https://anannya-ak.onrender.com";

  const [customUrl, setCustomUrl] = useState(defaultLocalUrl);
  const [activeUrl, setActiveUrl] = useState(defaultLocalUrl);

  const viewportWidths = {
    desktop: "w-full",
    tablet: "w-[768px]",
    mobile: "w-[390px]",
  };

  const handleRefresh = () => {
    // Force cache bust on iframe reload
    setKey((prev) => prev + 1);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setActiveUrl(customUrl.trim());
      setKey((prev) => prev + 1);
    }
  };

  const previewSource = `${activeUrl}${activeUrl.includes("?") ? "&" : "?"}_refresh=${key}`;

  return (
    <div className="space-y-4 animate-fade-in flex flex-col h-[calc(100vh-120px)]">
      {/* Viewport Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Live Website Preview</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time viewport preview connected to your Google Sheets database.
          </p>
        </div>

        {/* URL switcher & viewport controls */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleApplyUrl} className="flex items-center gap-1.5">
            <div className="relative">
              <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="http://localhost:5173 or URL"
                className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono w-56 sm:w-72 focus:outline-none focus:border-brand-500/60"
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium"
            >
              Set
            </button>
          </form>

          {/* Viewport switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-2 rounded-xl transition-all ${
                viewport === "desktop"
                  ? "bg-zinc-800 text-brand-400"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-2 rounded-xl transition-all ${
                viewport === "tablet"
                  ? "bg-zinc-800 text-brand-400"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-2 rounded-xl transition-all ${
                viewport === "mobile"
                  ? "bg-zinc-800 text-brand-400"
                  : "text-zinc-500 hover:text-white"
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 text-xs"
            title="Reload Frame & Bypass Cache"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-black/70 rounded-3xl border border-zinc-800 overflow-hidden flex items-center justify-center p-2 sm:p-4">
        <div
          className={`h-full transition-all duration-300 rounded-2xl overflow-hidden border border-zinc-700/60 shadow-2xl bg-zinc-950 ${viewportWidths[viewport]}`}
        >
          <iframe
            key={key}
            src={previewSource}
            title="Portfolio Public Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};
