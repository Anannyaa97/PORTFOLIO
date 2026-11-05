import React, { useState } from "react";
import { SEOSettings } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  Globe,
  Search,
  Check,
  FileCode,
  Share2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface SEOPageProps {
  seo: SEOSettings;
  onUpdateSEO: (seo: SEOSettings) => void;
}

export const SEOPage: React.FC<SEOPageProps> = ({ seo, onUpdateSEO }) => {
  const [metaTitle, setMetaTitle] = useState(
    seo?.metaTitle || "Anannya AK | Data Science & Software Engineering Portfolio"
  );
  const [metaDescription, setMetaDescription] = useState(
    seo?.metaDescription ||
      "Portfolio of Anannya AK — CSE Student specializing in Data Science & Software Engineering. Featuring big data pipelines, machine learning models, and modern software development."
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    seo?.canonicalUrl || "https://anannya-ak.onrender.com"
  );
  const [keywords, setKeywords] = useState(
    seo?.keywords || "Anannya AK, Data Science, Software Engineering, Python, PySpark, Machine Learning, Portfolio, Kannur"
  );
  const [ogImage, setOgImage] = useState(seo?.ogImage || "profile/profile.jpeg");
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const updated: SEOSettings = {
      id: seo?.id || "seo_1",
      metaTitle,
      metaDescription,
      canonicalUrl,
      keywords,
      ogImage,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await apiCall("updateSEO", "POST", {
        seo: {
          meta_title: metaTitle,
          meta_description: metaDescription,
          canonical_url: canonicalUrl,
          keywords,
          og_image: ogImage,
        },
      });

      if (res.success) {
        success("SEO Metadata Saved", "Search engine optimization and GEO records updated in Google Sheets.");
        onUpdateSEO(updated);
      } else {
        error("Update Failed", res.error);
      }
    } catch (err: any) {
      error("Save Error", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="pb-6 border-b border-zinc-800">
        <h2 className="text-xl font-bold font-display text-white">SEO &amp; Generative Engine Optimization (GEO)</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Configure search metadata, social graph cards, canonical domains, and entity definitions for AI crawlers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-400" />
              <span>Global Meta Tags</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Page Title Tag (&lt;title&gt;) *
                </label>
                <span className={`text-[10px] font-mono ${metaTitle.length > 60 ? "text-amber-400" : "text-zinc-500"}`}>
                  {metaTitle.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                required
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="[Page Name] | [Personal Name] – Portfolio"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Meta Description *
                </label>
                <span className={`text-[10px] font-mono ${metaDescription.length > 160 ? "text-amber-400" : "text-zinc-500"}`}>
                  {metaDescription.length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Accurately summarize your specialization, technical stack, and credentials..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Canonical Production URL
                </label>
                <input
                  type="url"
                  required
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://yourdomain.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Social Share Preview Image
                </label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="profile/profile.jpeg"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Target Search Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Data Science, Machine Learning, Python, PySpark, B.Tech CSE"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono text-[11px]"
              />
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-brand-500/20 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? "Saving to Sheets..." : "Save SEO Settings"}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {/* SERP Search Preview */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-brand-400" />
              <span>Google SERP Preview</span>
            </h4>
            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-1.5">
              <div className="text-[11px] font-mono text-zinc-400 truncate flex items-center gap-1">
                <Globe className="w-3 h-3 text-brand-400 shrink-0" />
                <span className="truncate">{canonicalUrl}</span>
              </div>
              <h5 className="text-sm font-semibold text-[#8ab4f8] hover:underline line-clamp-1 cursor-pointer">
                {metaTitle || "Anannya AK Portfolio"}
              </h5>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {metaDescription || "CSE Student specializing in Data Science and high-performance software engineering."}
              </p>
            </div>
          </div>

          {/* Social Graph Card Preview */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Open Graph &amp; Twitter Card</span>
            </h4>
            <div className="rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
              <div className="w-full h-28 bg-gradient-to-tr from-[#0B6E4F] to-[#50C878] flex items-center justify-center p-3 text-center">
                <span className="text-xs font-bold text-zinc-950 font-display">
                  {metaTitle}
                </span>
              </div>
              <div className="p-3 space-y-1">
                <div className="text-[10px] uppercase font-mono text-zinc-500">
                  {new URL(canonicalUrl || "https://anannya-ak.onrender.com").hostname}
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {metaTitle}
                </div>
                <div className="text-[11px] text-zinc-400 line-clamp-2">
                  {metaDescription}
                </div>
              </div>
            </div>
          </div>

          {/* Robot & Sitemap Status */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
            <h4 className="font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-brand-400" />
              <span>Indexing Assets</span>
            </h4>
            <div className="flex items-center justify-between text-zinc-300 pt-1">
              <span>Robots.txt</span>
              <span className="font-mono text-brand-400">/robots.txt ✓</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span>XML Sitemap</span>
              <span className="font-mono text-brand-400">/sitemap.xml ✓</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span>JSON-LD Schemas</span>
              <span className="font-mono text-brand-400">5 Schemas ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

