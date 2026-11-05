import React, { useState } from "react";
import { AppearanceSettings } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Save, Sliders, Palette, Check, Sparkles, Eye } from "lucide-react";

interface AppearancePageProps {
  appearance: AppearanceSettings;
  onUpdateAppearance: (settings: AppearanceSettings) => void;
}

const COLOR_PRESETS = [
  { name: "Signature Emerald", value: "#50C878" },
  { name: "Teal Mint", value: "#D1F2EB" },
  { name: "Forest Green", value: "#0B6E4F" },
  { name: "Cyber Cyan", value: "#06b6d4" },
  { name: "Electric Indigo", value: "#6366f1" },
  { name: "Golden Amber", value: "#f59e0b" },
];

export const AppearancePage: React.FC<AppearancePageProps> = ({
  appearance,
  onUpdateAppearance,
}) => {
  const [settings, setSettings] = useState<AppearanceSettings>({ ...appearance });
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const handleToggle = (key: keyof AppearanceSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await apiCall("updateAppearance", "POST", {
      settings,
    });

    setIsSaving(false);
    if (res.success) {
      success("Appearance Saved", "Styling parameters and section visibility updated.");
      onUpdateAppearance(settings);
    } else {
      error("Save Failed", res.error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Appearance &amp; Theme Engine</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure visual accents, dark/light aesthetics, and toggle sections on the public portfolio.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Appearance"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Accent Color Palette */}
        <div className="rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Theme Accent Color
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setSettings({ ...settings, accentColor: preset.value })}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all border ${
                  settings.accentColor.toLowerCase() === preset.value.toLowerCase()
                    ? "bg-zinc-800 text-white border-white/40 shadow-md"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: preset.value }}
                />
                <span>{preset.name}</span>
                {settings.accentColor.toLowerCase() === preset.value.toLowerCase() && (
                  <Check className="w-3 h-3 text-brand-400 ml-1" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">Custom Hex:</span>
            <input
              type="text"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-white w-32 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Section Visibility Toggles
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Control which sections are rendered on the live public portfolio without editing code.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { key: "showHero", label: "Hero Canvas & FlowField" },
              { key: "showAbout", label: "About & Profile Section" },
              { key: "showExperience", label: "Internship Experience" },
              { key: "showProjects", label: "Featured Projects Grid" },
              { key: "showSkills", label: "Skills & Technical Stack" },
              { key: "showContact", label: "Contact & Transmission Form" },
              { key: "showMusicPlayer", label: "Interactive Audio Hub" },
              { key: "enableAnimations", label: "Fluid Canvas Animations" },
            ].map((sec) => (
              <div
                key={sec.key}
                onClick={() => handleToggle(sec.key as keyof AppearanceSettings)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  settings[sec.key] !== false
                    ? "bg-zinc-900/80 border-brand-500/30 text-white"
                    : "bg-zinc-900/30 border-zinc-800 text-zinc-500"
                }`}
              >
                <span className="text-xs font-medium">{sec.label}</span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    settings[sec.key] !== false
                      ? "bg-brand-500 text-zinc-950 font-bold"
                      : "bg-zinc-800 text-zinc-600"
                  }`}
                >
                  {settings[sec.key] !== false ? "✓" : "×"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
