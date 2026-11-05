import React, { useState } from "react";
import { NavigationItem } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { Plus, Compass, Edit2, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";

interface NavigationPageProps {
  navigation: NavigationItem[];
  onUpdateNavigation: (nav: NavigationItem[]) => void;
}

export const NavigationPage: React.FC<NavigationPageProps> = ({
  navigation,
  onUpdateNavigation,
}) => {
  const [editingNav, setEditingNav] = useState<Partial<NavigationItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NavigationItem | null>(null);
  const { success, error } = useToast();

  const handleOpenCreate = () => {
    setEditingNav({
      label: "",
      href: "#",
      order: navigation.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NavigationItem) => {
    setEditingNav({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNav || !editingNav.label?.trim()) return;

    if (editingNav.id) {
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Navigation",
        id: editingNav.id,
        data: editingNav,
      });
      if (res.success) {
        success("Navigation Updated", `${editingNav.label} saved.`);
        onUpdateNavigation(
          navigation.map((n) => (n.id === editingNav.id ? (editingNav as NavigationItem) : n))
        );
      }
    } else {
      const res = await apiCall("createRecord", "POST", {
        sheetName: "Navigation",
        data: editingNav,
      });
      if (res.success && res.data) {
        success("Navigation Item Added", `${editingNav.label} created.`);
        onUpdateNavigation([...navigation, res.data]);
      }
    }
    setIsModalOpen(false);
    setEditingNav(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "Navigation",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Item Removed", `${deleteTarget.label} removed from navigation.`);
      onUpdateNavigation(navigation.filter((n) => n.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (item: NavigationItem) => {
    const newStatus = !item.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "Navigation",
      id: item.id,
      published: newStatus,
    });
    if (res.success) {
      success("Status Updated", `${item.label} publication toggled.`);
      onUpdateNavigation(
        navigation.map((n) => (n.id === item.id ? { ...n, published: newStatus } : n))
      );
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= navigation.length) return;

    const copy = [...navigation];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    copy.forEach((item, i) => (item.order = i + 1));
    onUpdateNavigation(copy);

    await apiCall("reorderRecords", "POST", {
      sheetName: "Navigation",
      orderedIds: copy.map((n) => n.id),
    });
    success("Order Saved", "Navigation items reordered.");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Navigation Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure menu items for GooeyNav bar and footer links on the public portfolio.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      <div className="rounded-3xl bg-[#141417] border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden shadow-lg">
        {navigation.map((item, index) => (
          <div key={item.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-zinc-500">
                <button
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                  className="p-1 hover:text-white disabled:opacity-20"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={index === navigation.length - 1}
                  onClick={() => handleMove(index, "down")}
                  className="p-1 hover:text-white disabled:opacity-20"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                <div className="text-xs font-mono text-zinc-500">{item.href}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePublish(item)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                  item.published
                    ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                    : "bg-zinc-800 text-zinc-500 border-zinc-700"
                }`}
              >
                {item.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{item.published ? "Active" : "Disabled"}</span>
              </button>

              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteTarget(item)}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingNav && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingNav.id ? "Edit Menu Link" : "Add Menu Link"}
            </h3>
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  value={editingNav.label || ""}
                  onChange={(e) =>
                    setEditingNav({ ...editingNav, label: e.target.value })
                  }
                  placeholder="e.g. Projects, Experience..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Target Link Anchor (href)
                </label>
                <input
                  type="text"
                  value={editingNav.href || ""}
                  onChange={(e) =>
                    setEditingNav({ ...editingNav, href: e.target.value })
                  }
                  placeholder="e.g. #projects or https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Menu Link"
        message={`Delete "${deleteTarget?.label}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
