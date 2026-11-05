import React, { useState } from "react";
import { About } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Save, BookOpen, GraduationCap, Award } from "lucide-react";

interface AboutPageProps {
  about: About;
  onUpdate: (updated: About) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ about, onUpdate }) => {
  const [formData, setFormData] = useState<About>({ ...about });
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const handleChange = (field: keyof About, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await apiCall("updateRecord", "POST", {
      sheetName: "About",
      id: formData.id || "about_1",
      data: formData,
    });

    setIsSaving(false);
    if (res.success) {
      success("About Section Saved", "Narrative updated in Google Sheets.");
      onUpdate(formData);
    } else {
      error("Save Failed", res.error || "Could not save about record.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">About &amp; Narrative Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Customize the verified academic journey, institutional profile, and engineering narrative.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Narrative"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Narrative Title */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Section Header Title
          </label>
          <input
            type="text"
            value={formData.narrativeTitle}
            onChange={(e) => handleChange("narrativeTitle", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        {/* Primary Narrative */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Professional Narrative (Paragraph 1)
          </label>
          <textarea
            rows={4}
            value={formData.narrativeBody}
            onChange={(e) => handleChange("narrativeBody", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
            required
          />
        </div>

        {/* Secondary Sub Narrative */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Core Technical Interests (Paragraph 2)
          </label>
          <textarea
            rows={4}
            value={formData.narrativeSub || ""}
            onChange={(e) => handleChange("narrativeSub", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
          />
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Current Academic Focus
            </label>
            <input
              type="text"
              value={formData.currentFocus}
              onChange={(e) => handleChange("currentFocus", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              College Institution
            </label>
            <input
              type="text"
              value={formData.collegeName}
              onChange={(e) => handleChange("collegeName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Cumulative CGPA
            </label>
            <input
              type="text"
              value={formData.cgpa}
              onChange={(e) => handleChange("cgpa", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
