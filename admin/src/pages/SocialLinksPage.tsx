import React, { useState } from "react";
import { SocialLink } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { Plus, Share2, Edit2, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";

interface SocialLinksPageProps {
  socialLinks: SocialLink[];
  onUpdateSocialLinks: (links: SocialLink[]) => void;
}

export const SocialLinksPage: React.FC<SocialLinksPageProps> = ({
  socialLinks,
  onUpdateSocialLinks,
}) => {
  const [editingLink, setEditingLink] = useState<Partial<SocialLink> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);
  const { success, error } = useToast();

  const handleOpenCreate = () => {
    setEditingLink({
      platform: "GitHub",
      label: "GitHub Profile",
      url: "https://github.com/",
      iconName: "Github",
      order: socialLinks.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setEditingLink({ ...link });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink || !editingLink.url?.trim()) return;

    if (editingLink.id) {
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "SocialLinks",
        id: editingLink.id,
        data: editingLink,
      });
      if (res.success) {
        success("Social Link Updated", `${editingLink.platform} saved.`);
        onUpdateSocialLinks(
          socialLinks.map((s) => (s.id === editingLink.id ? (editingLink as SocialLink) : s))
        );
      }
    } else {
      const res = await apiCall("createRecord", "POST", {
        sheetName: "SocialLinks",
        data: editingLink,
      });
      if (res.success && res.data) {
        success("Social Link Added", `${editingLink.platform} created.`);
        onUpdateSocialLinks([...socialLinks, res.data]);
      }
    }
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "SocialLinks",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Social Link Deleted", `${deleteTarget.platform} removed.`);
      onUpdateSocialLinks(socialLinks.filter((s) => s.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (link: SocialLink) => {
    const newStatus = !link.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "SocialLinks",
      id: link.id,
      published: newStatus,
    });
    if (res.success) {
      success("Status Updated", `${link.platform} is now ${newStatus ? "active" : "hidden"}.`);
      onUpdateSocialLinks(
        socialLinks.map((s) => (s.id === link.id ? { ...s, published: newStatus } : s))
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Social Links Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Maintain external professional network links displayed in the hero, about, contact, and footer sections.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Link</span>
        </button>
      </div>

      <div className="rounded-3xl bg-[#141417] border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden shadow-lg">
        {socialLinks.map((link) => (
          <div key={link.id} className="p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">{link.platform}</div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-zinc-400 hover:text-brand-400 flex items-center gap-1 mt-0.5"
              >
                <span>{link.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePublish(link)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                  link.published
                    ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                    : "bg-zinc-800 text-zinc-500 border-zinc-700"
                }`}
              >
                {link.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{link.published ? "Visible" : "Hidden"}</span>
              </button>

              <button
                onClick={() => handleOpenEdit(link)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteTarget(link)}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingLink.id ? "Edit Social Link" : "Add Social Link"}
            </h3>
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Platform Name *
                </label>
                <input
                  type="text"
                  value={editingLink.platform || ""}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, platform: e.target.value })
                  }
                  placeholder="e.g. GitHub, LinkedIn, Kaggle, X"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Target Destination URL *
                </label>
                <input
                  type="text"
                  value={editingLink.url || ""}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
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
        title="Delete Social Handle"
        message={`Delete ${deleteTarget?.platform}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
