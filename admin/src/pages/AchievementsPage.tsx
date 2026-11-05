import React, { useState } from "react";
import { Achievement, MediaItem } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { MediaPickerModal } from "../components/MediaPickerModal";
import { Plus, Trophy, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";

interface AchievementsPageProps {
  achievements: Achievement[];
  onUpdateAchievements: (achievements: Achievement[]) => void;
  mediaItems: MediaItem[];
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  onUpdateAchievements,
  mediaItems,
}) => {
  const [editingAch, setEditingAch] = useState<Partial<Achievement> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const { success, error } = useToast();

  const handleOpenCreate = () => {
    setEditingAch({
      title: "",
      description: "",
      date: "2025",
      imageUrl: "",
      associatedEvent: "",
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingAch({ ...ach });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch || !editingAch.title?.trim()) return;

    if (editingAch.id) {
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Achievements",
        id: editingAch.id,
        data: editingAch,
      });
      if (res.success) {
        success("Achievement Saved", `${editingAch.title} updated.`);
        onUpdateAchievements(
          achievements.map((a) => (a.id === editingAch.id ? (editingAch as Achievement) : a))
        );
      }
    } else {
      const res = await apiCall("createRecord", "POST", {
        sheetName: "Achievements",
        data: editingAch,
      });
      if (res.success && res.data) {
        success("Achievement Created", `${editingAch.title} added.`);
        onUpdateAchievements([...achievements, res.data]);
      }
    }
    setIsModalOpen(false);
    setEditingAch(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "Achievements",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Achievement Deleted", `${deleteTarget.title} deleted.`);
      onUpdateAchievements(achievements.filter((a) => a.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (ach: Achievement) => {
    const newStatus = !ach.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "Achievements",
      id: ach.id,
      published: newStatus,
    });
    if (res.success) {
      success("Status Updated", `${ach.title} publication state toggled.`);
      onUpdateAchievements(
        achievements.map((a) => (a.id === ach.id ? { ...a, published: newStatus } : a))
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Achievements Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Honors, hackathon recognitions, competitive milestones, and awards.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-brand-400 font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 border border-brand-500/30">
                  {ach.date}
                </span>
                <button
                  onClick={() => togglePublish(ach)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                    ach.published
                      ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                      : "bg-zinc-800 text-zinc-500 border-zinc-700"
                  }`}
                >
                  {ach.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{ach.published ? "Published" : "Draft"}</span>
                </button>
              </div>

              <h4 className="text-base font-bold text-white">{ach.title}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{ach.description}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-mono">{ach.associatedEvent}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(ach)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(ach)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingAch.id ? "Edit Achievement" : "Add Achievement"}
            </h3>
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={editingAch.title || ""}
                  onChange={(e) =>
                    setEditingAch({ ...editingAch, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingAch.description || ""}
                  onChange={(e) =>
                    setEditingAch({ ...editingAch, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editingAch.date || ""}
                    onChange={(e) =>
                      setEditingAch({ ...editingAch, date: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Associated Event
                  </label>
                  <input
                    type="text"
                    value={editingAch.associatedEvent || ""}
                    onChange={(e) =>
                      setEditingAch({ ...editingAch, associatedEvent: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Achievement"
        message={`Delete "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
