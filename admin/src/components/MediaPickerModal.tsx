import React, { useState } from "react";
import { Upload, X, Check, Image as ImageIcon, FileText, Music, Search } from "lucide-react";
import { MediaItem } from "../types";
import { apiCall, fileToBase64 } from "../services/api";
import { useToast } from "../context/ToastContext";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUrl: (url: string) => void;
  allowedCategory?: "Images" | "Documents" | "Audio";
  mediaItems: MediaItem[];
  onMediaUploaded?: (newMedia: MediaItem) => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectUrl,
  allowedCategory,
  mediaItems,
  onMediaUploaded,
}) => {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { success, error } = useToast();

  if (!isOpen) return null;

  const filteredItems = mediaItems.filter((item) => {
    const matchesCategory = allowedCategory ? item.category === allowedCategory : true;
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const base64 = await fileToBase64(file);
      const category = file.type.startsWith("image/")
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
        success("Media Uploaded", `${file.name} saved successfully.`);
        if (onMediaUploaded) onMediaUploaded(res.media);
        onSelectUrl(res.media.publicUrl);
        onClose();
      } else {
        error("Upload Failed", res.error || "Could not save media file");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#121215] border border-zinc-800 p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white">Select Asset</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Choose an asset from Google Drive or upload a new file
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-3">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "library"
                ? "bg-brand-500 text-zinc-950 shadow-md shadow-brand-500/20"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Media Library ({filteredItems.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "upload"
                ? "bg-brand-500 text-zinc-950 shadow-md shadow-brand-500/20"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Upload New File
          </button>
        </div>

        {/* Tab 1: Library */}
        {activeTab === "library" && (
          <div className="flex-1 flex flex-col overflow-hidden pt-2">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search files by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
              {filteredItems.length === 0 ? (
                <div className="col-span-full py-12 text-center text-zinc-500 text-xs">
                  No files found matching criteria. Upload a new file above.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectUrl(item.publicUrl);
                      onClose();
                    }}
                    className="group relative rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-brand-500 p-2.5 cursor-pointer transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <div className="w-full aspect-video rounded-xl bg-black/40 overflow-hidden flex items-center justify-center mb-2">
                      {item.category === "Images" ? (
                        <img
                          src={item.publicUrl}
                          alt={item.fileName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : item.category === "Audio" ? (
                        <Music className="w-8 h-8 text-brand-400" />
                      ) : (
                        <FileText className="w-8 h-8 text-sky-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white truncate">{item.fileName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between mt-1">
                        <span>{item.category}</span>
                        <span>{Math.round(item.sizeBytes / 1024)} KB</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Upload */}
        {activeTab === "upload" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`w-full py-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center transition-all ${
                dragActive
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40"
              }`}
            >
              <div className="p-4 rounded-full bg-brand-500/10 text-brand-400 mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">Drag &amp; drop file here</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Supports Images, PDFs, and Audio. Files are synced to Google Drive.
              </p>

              <label className="mt-4 px-4 py-2 rounded-xl bg-brand-500 text-zinc-950 font-bold text-xs cursor-pointer hover:bg-brand-400 transition-all shadow-md shadow-brand-500/20">
                {isUploading ? "Uploading to Drive..." : "Browse Files"}
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
          </div>
        )}
      </div>
    </div>
  );
};
