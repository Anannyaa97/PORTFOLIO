import React, { useState } from "react";
import { MusicTrack, MediaItem } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { MediaPickerModal } from "../components/MediaPickerModal";
import {
  Plus,
  Music,
  Play,
  Pause,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Disc3,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface MusicPlayerPageProps {
  music: MusicTrack[];
  onUpdateMusic: (tracks: MusicTrack[]) => void;
  mediaItems: MediaItem[];
}

export const MusicPlayerPage: React.FC<MusicPlayerPageProps> = ({
  music,
  onUpdateMusic,
  mediaItems,
}) => {
  const [editingTrack, setEditingTrack] = useState<Partial<MusicTrack> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MusicTrack | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const { success, error } = useToast();

  const handleOpenCreate = () => {
    setEditingTrack({
      title: "",
      artist: "Anannya AK",
      category: "Ambient Lo-Fi",
      audioUrl: "audio/deep-focus.wav",
      color: "#50C878",
      order: music.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (track: MusicTrack) => {
    setEditingTrack({ ...track });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack || !editingTrack.title?.trim() || !editingTrack.audioUrl?.trim()) return;

    if (editingTrack.id) {
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Music",
        id: editingTrack.id,
        data: editingTrack,
      });
      if (res.success) {
        success("Track Saved", `${editingTrack.title} updated.`);
        onUpdateMusic(
          music.map((m) => (m.id === editingTrack.id ? (editingTrack as MusicTrack) : m))
        );
      }
    } else {
      const res = await apiCall("createRecord", "POST", {
        sheetName: "Music",
        data: editingTrack,
      });
      if (res.success && res.data) {
        success("Track Added", `${editingTrack.title} added to audio hub.`);
        onUpdateMusic([...music, res.data]);
      }
    }
    setIsModalOpen(false);
    setEditingTrack(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "Music",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Track Deleted", `${deleteTarget.title} removed.`);
      onUpdateMusic(music.filter((m) => m.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (track: MusicTrack) => {
    const newStatus = !track.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "Music",
      id: track.id,
      published: newStatus,
    });
    if (res.success) {
      success("Track Toggled", `${track.title} is now ${newStatus ? "enabled" : "disabled"}.`);
      onUpdateMusic(
        music.map((m) => (m.id === track.id ? { ...m, published: newStatus } : m))
      );
    }
  };

  const togglePlayback = (track: MusicTrack) => {
    if (playingId === track.id) {
      audioEl?.pause();
      setPlayingId(null);
    } else {
      if (audioEl) audioEl.pause();
      const a = new Audio(track.audioUrl);
      a.play().catch(() => {
        error("Playback Error", `Could not play ${track.audioUrl}. Check if file exists.`);
      });
      a.onended = () => setPlayingId(null);
      setAudioEl(a);
      setPlayingId(track.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Music Player Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Curate coding session soundtracks, synthwave loops, and atmospheric focus tracks.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Audio Track</span>
        </button>
      </div>

      <div className="rounded-3xl bg-[#141417] border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden shadow-lg">
        {music.map((track) => (
          <div key={track.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePlayback(track)}
                className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 flex items-center justify-center hover:bg-brand-500/30 transition-all shrink-0"
                title="Preview Track"
              >
                {playingId === track.id ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <div>
                <div className="text-xs font-mono uppercase text-brand-400 font-semibold">
                  {track.category}
                </div>
                <h4 className="text-sm font-bold text-white">{track.title}</h4>
                <div className="text-xs text-zinc-400">{track.artist}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePublish(track)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                  track.published
                    ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                    : "bg-zinc-800 text-zinc-500 border-zinc-700"
                }`}
              >
                {track.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{track.published ? "Active" : "Disabled"}</span>
              </button>

              <button
                onClick={() => handleOpenEdit(track)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteTarget(track)}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingTrack.id ? "Edit Track" : "Add New Audio Track"}
            </h3>
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Track Title *
                </label>
                <input
                  type="text"
                  value={editingTrack.title || ""}
                  onChange={(e) =>
                    setEditingTrack({ ...editingTrack, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Artist / Subtitle
                </label>
                <input
                  type="text"
                  value={editingTrack.artist || ""}
                  onChange={(e) =>
                    setEditingTrack({ ...editingTrack, artist: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={editingTrack.category || ""}
                  onChange={(e) =>
                    setEditingTrack({ ...editingTrack, category: e.target.value })
                  }
                  placeholder="e.g. Melodic Synthwave"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Audio File URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingTrack.audioUrl || ""}
                    onChange={(e) =>
                      setEditingTrack({ ...editingTrack, audioUrl: e.target.value })
                    }
                    placeholder="audio/track.wav or Drive URL"
                    className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white flex items-center gap-1"
                  >
                    <Music className="w-3.5 h-3.5 text-brand-400" />
                    <span>Browse</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-brand-500 hover:bg-brand-400"
                >
                  Save Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker for Audio */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        allowedCategory="Audio"
        mediaItems={mediaItems}
        onSelectUrl={(url) => {
          if (editingTrack) setEditingTrack({ ...editingTrack, audioUrl: url });
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Audio Track"
        message={`Delete "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
