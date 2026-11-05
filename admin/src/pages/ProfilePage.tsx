import React, { useState } from "react";
import { Profile, MediaItem } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { MediaPickerModal } from "../components/MediaPickerModal";
import { Save, Image as ImageIcon, FileText, CheckCircle2, MapPin, Mail, Sparkles } from "lucide-react";

interface ProfilePageProps {
  profile: Profile;
  onUpdate: (updated: Profile) => void;
  mediaItems: MediaItem[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onUpdate, mediaItems }) => {
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"avatar" | "resume" | null>(null);
  const { success, error } = useToast();

  const handleChange = (field: keyof Profile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await apiCall("updateRecord", "POST", {
      sheetName: "Profile",
      id: formData.id || "profile_1",
      data: formData,
    });

    setIsSaving(false);
    if (res.success) {
      success("Profile Updated", "Changes saved to Google Sheets successfully.");
      onUpdate(formData);
    } else {
      error("Save Failed", res.error || "Could not update profile record.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Profile Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure primary biography, hero highlights, avatar portrait, and resume asset.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Profile"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Fields */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Availability / Status Badge
            </label>
            <input
              type="text"
              value={formData.availabilityStatus}
              onChange={(e) => handleChange("availabilityStatus", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Short Introduction (Headline)
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Comprehensive Bio
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Profile Image Asset Picker */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Profile Avatar Image URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.avatarUrl}
                onChange={(e) => handleChange("avatarUrl", e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setMediaPickerTarget("avatar")}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors shrink-0"
              >
                <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
                <span>Media Library</span>
              </button>
            </div>
          </div>

          {/* Resume Asset Picker */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Resume Document (PDF) URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.resumeUrl}
                onChange={(e) => handleChange("resumeUrl", e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setMediaPickerTarget("resume")}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-brand-400" />
                <span>Media Library</span>
              </button>
            </div>
          </div>

          {/* Location & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Highlight Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => handleChange("specialization", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Academic Score
              </label>
              <input
                type="text"
                value={formData.academicScore}
                onChange={(e) => handleChange("academicScore", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Industry Exp
              </label>
              <input
                type="text"
                value={formData.industryExpCount}
                onChange={(e) => handleChange("industryExpCount", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </form>

        {/* Live Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3 text-center">
            Live Preview Simulation
          </div>

          <div className="w-full max-w-sm rounded-3xl bg-[#141416] border border-zinc-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
                <img
                  src={formData.avatarUrl || "profile/profile.jpeg"}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <div className="text-xs font-mono text-brand-400 font-semibold">
                  {formData.availabilityStatus}
                </div>
                <h4 className="text-lg font-bold font-display text-white">{formData.name}</h4>
                <div className="text-xs text-zinc-400">{formData.title}</div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80">
              {formData.bio}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-zinc-800">
              <div className="p-2 rounded-xl bg-zinc-900">
                <div className="text-[10px] text-zinc-500">Spec</div>
                <div className="font-semibold text-white truncate">{formData.specialization}</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900">
                <div className="text-[10px] text-zinc-500">Score</div>
                <div className="font-semibold text-brand-400 truncate">{formData.academicScore}</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900">
                <div className="text-[10px] text-zinc-500">Exp</div>
                <div className="font-semibold text-white truncate">{formData.industryExpCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={!!mediaPickerTarget}
        onClose={() => setMediaPickerTarget(null)}
        allowedCategory={mediaPickerTarget === "avatar" ? "Images" : "Documents"}
        mediaItems={mediaItems}
        onSelectUrl={(url) => {
          if (mediaPickerTarget === "avatar") handleChange("avatarUrl", url);
          if (mediaPickerTarget === "resume") handleChange("resumeUrl", url);
        }}
      />
    </div>
  );
};
