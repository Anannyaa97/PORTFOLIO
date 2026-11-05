import React, { useState } from "react";
import { ContactSettings } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Save, Mail, MapPin, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";

interface ContactPageProps {
  contact: ContactSettings;
  onUpdateContact: (contact: ContactSettings) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ contact, onUpdateContact }) => {
  const [formData, setFormData] = useState<ContactSettings>({ ...contact });
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const handleChange = (field: keyof ContactSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await apiCall("updateRecord", "POST", {
      sheetName: "Contact",
      id: formData.id || "contact_1",
      data: formData,
    });

    setIsSaving(false);
    if (res.success) {
      success("Contact Settings Saved", "Contact channels and transmission parameters updated.");
      onUpdateContact(formData);
    } else {
      error("Save Failed", res.error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Contact &amp; Transmission Settings</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure direct communication channels, transmission form preferences, and notification routing.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Primary Public Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Public Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Optional Phone / Telegram
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 ..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Notification Routing Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="email"
                value={formData.notificationEmail || formData.email}
                onChange={(e) => handleChange("notificationEmail", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Form Behavior Box */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <h4 className="text-sm font-semibold text-white">Transmission Protocol Options</h4>
          <label className="flex items-center gap-3 cursor-pointer text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={formData.formEnabled}
              onChange={(e) => handleChange("formEnabled", e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-brand-500"
            />
            <span>Enable Interactive Transmission Form on Public Website</span>
          </label>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">
            When enabled, messages submitted on the portfolio contact section are automatically recorded into Google Sheets and emailed to {formData.notificationEmail || formData.email}.
          </p>
        </div>
      </form>
    </div>
  );
};
