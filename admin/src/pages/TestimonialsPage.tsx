import React, { useState } from "react";
import { Testimonial } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import {
  MessageSquare,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  User,
  Building,
  Check,
} from "lucide-react";

interface TestimonialsPageProps {
  testimonials: Testimonial[];
  onUpdateTestimonials: (testimonials: Testimonial[]) => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({
  testimonials,
  onUpdateTestimonials,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const { success, error } = useToast();

  const filtered = testimonials.filter(
    (t) =>
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingItem({
      clientName: "",
      clientRole: "",
      company: "",
      quote: "",
      avatarUrl: "",
      rating: 5,
      order: testimonials.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.clientName?.trim() || !editingItem.quote?.trim()) {
      error("Validation Error", "Client name and testimonial quote are required.");
      return;
    }

    if (editingItem.id) {
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Testimonials",
        id: editingItem.id,
        data: editingItem,
      });
      if (res.success) {
        success("Testimonial Saved", `Feedback from ${editingItem.clientName} updated in Google Sheets.`);
        onUpdateTestimonials(
          testimonials.map((t) => (t.id === editingItem.id ? (editingItem as Testimonial) : t))
        );
        setIsModalOpen(false);
      } else {
        error("Update Failed", res.error);
      }
    } else {
      const res = await apiCall("createRecord", "POST", {
        sheetName: "Testimonials",
        data: editingItem,
      });
      if (res.success && res.data) {
        success("Testimonial Added", `Feedback from ${editingItem.clientName} recorded in Google Sheets.`);
        onUpdateTestimonials([...testimonials, res.data]);
        setIsModalOpen(false);
      } else {
        error("Create Failed", res.error);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "Testimonials",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Testimonial Deleted", `Feedback from ${deleteTarget.clientName} removed.`);
      onUpdateTestimonials(testimonials.filter((t) => t.id !== deleteTarget.id));
    } else {
      error("Delete Failed", res.error);
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (item: Testimonial) => {
    const newStatus = !item.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "Testimonials",
      id: item.id,
      published: newStatus,
    });
    if (res.success) {
      success(
        newStatus ? "Testimonial Published" : "Testimonial Unpublished",
        `Feedback is now ${newStatus ? "visible on public portfolio" : "hidden as draft"}.`
      );
      onUpdateTestimonials(
        testimonials.map((t) => (t.id === item.id ? { ...t, published: newStatus } : t))
      );
    } else {
      error("Status Update Failed", res.error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Testimonials &amp; Endorsements</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage academic recommendations, mentor feedback, and collaborative peer reviews.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by client, company, or quote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500/60"
          />
        </div>
        <span className="text-xs font-mono text-zinc-500">
          Showing {filtered.length} of {testimonials.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all ${
              item.published
                ? "bg-zinc-900/60 border-zinc-800 hover:border-brand-500/30"
                : "bg-zinc-950/40 border-zinc-800/40 opacity-70"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold font-mono text-xs overflow-hidden">
                  {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt={item.clientName} className="w-full h-full object-cover" />
                  ) : (
                    item.clientName.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.clientName}</h4>
                  <p className="text-[11px] text-zinc-400">
                    {item.clientRole} {item.company ? `• ${item.company}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-xs font-mono">{item.rating || 5}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 italic line-clamp-3 mb-4">
              "{item.quote}"
            </p>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                onClick={() => togglePublish(item)}
                className={`flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-lg transition-colors ${
                  item.published
                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{item.published ? "Published" : "Draft"}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-white">
                {editingItem.id ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Client / Endorser Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.clientName || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                  placeholder="e.g. Dr. K. Ramanathan"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Role / Designation
                  </label>
                  <input
                    type="text"
                    value={editingItem.clientRole || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, clientRole: e.target.value })}
                    placeholder="e.g. Associate Professor"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={editingItem.company || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g. St. Thomas College of Engg."
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Quote / Feedback Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.quote || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  placeholder="Write the full recommendation text..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Rating (1 to 5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editingItem.rating || 5}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Avatar Image URL
                  </label>
                  <input
                    type="text"
                    value={editingItem.avatarUrl || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-brand-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Save to Google Sheets</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete Testimonial"
          message={`Are you sure you want to permanently delete the endorsement from "${deleteTarget.clientName}"? This will remove the row from Google Sheets.`}
          confirmLabel="Delete Record"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

