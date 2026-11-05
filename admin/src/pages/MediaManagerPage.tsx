import React, { useState } from "react";
import { MediaItem } from "../types";
import { apiCall, fileToBase64 } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import {
  Upload,
  Search,
  Image as ImageIcon,
  FileText,
  Music,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Play,
  Pause,
  FolderOpen,
} from "lucide-react";

interface MediaManagerPageProps {
  mediaItems: MediaItem[];
  onUpdateMedia: (items: MediaItem[]) => void;
  initialFilter?: "All" | "Images" | "Documents" | "Audio";
}

export const MediaManagerPage: React.FC<MediaManagerPageProps> = ({
  mediaItems,
  onUpdateMedia,
  initialFilter = "All",
}) => {
  const [activeTab, setActiveTab] = useState<"All" | "Images" | "Documents" | "Audio">(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { success, error } = useToast();

  const filteredMedia = mediaItems.filter((item) => {
    const matchesTab = activeTab === "All" || item.category === activeTab;
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const base64 = await fileToBase64(file);
      const category: MediaItem["category"] = file.type.startsWith("image/")
        ? "Images"
        : file.type.startsWith("audio/")
        ? "Audio"
        : "Documents";

      const res = await apiCall("uploadMedia", "POST", {
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        category,
        base64,
        previewUrl: URL.createObjectURL(file),
      });

      setIsUploading(false);
      if (res.success && res.media) {
        success("File Uploaded to Google Drive", `${file.name} saved to Google Drive and registered in Sheets.`);
        onUpdateMedia([res.media, ...mediaItems]);
      } else {
        error("Upload Failed", res.error || "Could not store file in Google Drive");
      }
    } catch (err: any) {
      setIsUploading(false);
      error("Upload Error", err.message || "Failed to process file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.publicUrl);
    setCopiedId(item.id);
    success("Link Copied", "Direct asset URL copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteMedia", "POST", {
      id: deleteTarget.id,
      driveFileId: deleteTarget.driveFileId,
    });
    if (res.success) {
      success("Media Removed", `${deleteTarget.fileName} deleted.`);
      onUpdateMedia(mediaItems.filter((m) => m.id !== deleteTarget.id));
    } else {
      error("Delete Failed", res.error);
    }
    setDeleteTarget(null);
  };

  const toggleAudio = (item: MediaItem) => {
    if (playingAudioId === item.id) {
      audioElement?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioElement) audioElement.pause();
      const audio = new Audio(item.publicUrl);
      audio.play().catch(() => {
        error("Audio Playback Error", "Could not play preview stream.");
      });
      audio.onended = () => setPlayingAudioId(null);
      setAudioElement(audio);
      setPlayingAudioId(item.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Media Manager</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Store and manage assets in Google Drive. Metadata and file IDs are tracked in Google Sheets.
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? "Uploading to Drive..." : "Upload Asset"}</span>
          <input
            type="file"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`p-6 sm:p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center transition-all ${
          dragActive
            ? "border-brand-500 bg-brand-500/10"
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30"
        }`}
      >
        <div className="p-3 rounded-2xl bg-zinc-800 text-brand-400 mb-2">
          <FolderOpen className="w-6 h-6" />
        </div>
        <div className="text-sm font-semibold text-white">
          Drop assets here or click "Upload Asset"
        </div>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm">
          Images (JPEG, PNG, SVG), Documents (PDF resumes, credentials), and Audio tracks (.wav, .mp3).
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["All", "Images", "Documents", "Audio"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-brand-500 text-zinc-950 shadow-md shadow-brand-500/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Grid of Media Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 text-xs">
            No media files found in this category. Upload files above to populate your library.
          </div>
        ) : (
          filteredMedia.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#141417] border border-zinc-800 p-4 shadow-lg flex flex-col justify-between hover:border-zinc-700 transition-all group"
            >
              {/* Media Preview Thumbnail */}
              <div className="relative w-full aspect-video rounded-2xl bg-zinc-900 overflow-hidden flex items-center justify-center mb-3">
                {item.category === "Images" ? (
                  <img
                    src={item.publicUrl}
                    alt={item.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => setPreviewMedia(item)}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : item.category === "Audio" ? (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => toggleAudio(item)}
                      className="p-3 rounded-full bg-brand-500 text-zinc-950 hover:bg-brand-400 transition-all shadow-md shadow-brand-500/20"
                    >
                      {playingAudioId === item.id ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                    <span className="text-[10px] font-mono text-zinc-400">Audio Track</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-sky-400">
                    <FileText className="w-8 h-8" />
                    <span className="text-[10px] font-mono text-zinc-400">PDF Document</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <h4 className="text-xs font-semibold text-white truncate" title={item.fileName}>
                  {item.fileName}
                </h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>{item.category}</span>
                  <span>{Math.round(item.sizeBytes / 1024)} KB</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-brand-400 transition-colors"
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-brand-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === item.id ? "Copied" : "Copy URL"}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <a
                    href={item.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete Media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Lightbox Preview Modal */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewMedia(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewMedia.publicUrl}
              alt={previewMedia.fileName}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <div className="text-center mt-2 text-xs font-mono text-zinc-300">
              {previewMedia.fileName}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Media Asset"
        message={`Delete "${deleteTarget?.fileName}"? The file will be moved to Google Drive trash and removed from the database.`}
        confirmLabel="Delete Asset"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
