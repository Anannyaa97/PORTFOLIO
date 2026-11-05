import React, { useState } from "react";
import { ResumeItem, MediaItem } from "../types";
import { apiCall, fileToBase64 } from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  FileText,
  Upload,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  HardDrive,
  FileCheck,
  AlertCircle,
} from "lucide-react";

interface ResumePageProps {
  resume: ResumeItem[];
  onUpdateResume: (resume: ResumeItem[]) => void;
  mediaItems: MediaItem[];
}

export const ResumePage: React.FC<ResumePageProps> = ({
  resume,
  onUpdateResume,
  mediaItems,
}) => {
  const currentResume = resume?.[0] || {
    id: "res_1",
    title: "Anannya AK — Official Curriculum Vitae",
    version: "2026.1",
    fileUrl: "resume.pdf",
    isActive: true,
    updatedAt: new Date().toISOString(),
  };

  const [title, setTitle] = useState(currentResume.title || "");
  const [version, setVersion] = useState(currentResume.version || "1.0");
  const [fileUrl, setFileUrl] = useState(currentResume.fileUrl || "resume.pdf");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      error("Invalid File Type", "Please select a valid PDF document for your resume.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      error("File Too Large", "Resume PDF must be less than 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await apiCall("uploadMedia", "POST", {
        fileName: file.name,
        mimeType: "application/pdf",
        category: "Documents",
        base64,
      });

      if (res.success && res.media) {
        setFileUrl(res.media.file_url || res.media.publicUrl);
        success("Resume Uploaded", `${file.name} saved to Google Drive and ready to link.`);
      } else {
        error("Upload Failed", res.error || "Failed to upload PDF to Google Drive.");
      }
    } catch (err: any) {
      error("Upload Error", err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const updatedRecord: ResumeItem = {
      ...currentResume,
      title,
      version,
      fileUrl,
      isActive: true,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Resume",
        id: currentResume.id || "res_1",
        data: updatedRecord,
      });

      if (res.success) {
        success("Resume Configured", "Latest resume published and synchronized with Google Sheets.");
        onUpdateResume([updatedRecord]);
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
        <h2 className="text-xl font-bold font-display text-white">Resume &amp; CV Management</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your active PDF resume document served to recruiters and technical evaluators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand-400" />
              <span>Resume Publication Details</span>
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Resume Document Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Anannya AK — Data Science Curriculum Vitae"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Version Identifier
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="2026.1"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Status
                </label>
                <div className="flex items-center gap-2 h-9 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-brand-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                  <span>Active &amp; Public</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Public File Destination / URL
              </label>
              <input
                type="text"
                required
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="resume.pdf or https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Relative path in the repository (e.g. <code>resume.pdf</code>) or a direct Google Drive CDN URL.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium cursor-pointer transition-colors border border-zinc-700">
                <Upload className="w-4 h-4 text-brand-400" />
                <span>{isUploading ? "Uploading to Drive..." : "Upload New PDF to Drive"}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-brand-500/20 disabled:opacity-50"
              >
                <span>{isSaving ? "Syncing..." : "Update Google Sheets"}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-brand-400" />
              <span>Active Resume Snapshot</span>
            </h4>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <FileText className="w-4 h-4 text-brand-400" />
                <span className="truncate">{title || "Resume Document"}</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                Version: <span className="text-brand-400">{version}</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono truncate">
                Target: <span className="text-zinc-300">{fileUrl}</span>
              </div>
            </div>

            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Preview Current File</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

