import React, { useState } from "react";
import { Experience } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import {
  Plus,
  Briefcase,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Terminal,
  Database,
} from "lucide-react";

interface ExperiencePageProps {
  experience: Experience[];
  onUpdateExperience: (exp: Experience[]) => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({
  experience,
  onUpdateExperience,
}) => {
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [bulletInput, setBulletInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const { success, error } = useToast();

  const handleOpenCreate = () => {
    setEditingExp({
      role: "",
      company: "",
      period: "June 2026",
      type: "Internship Protocol",
      description: ["Contributed to core development and system testing."],
      technologies: ["Python"],
      iconName: "Terminal",
      accent: "emerald",
      order: experience.length + 1,
      published: true,
    });
    setBulletInput("");
    setTechInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setBulletInput("");
    setTechInput("");
    setIsModalOpen(true);
  };

  const handleAddBullet = () => {
    if (!bulletInput.trim() || !editingExp) return;
    setEditingExp({
      ...editingExp,
      description: [...(editingExp.description || []), bulletInput.trim()],
    });
    setBulletInput("");
  };

  const handleRemoveBullet = (idx: number) => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      description: (editingExp.description || []).filter((_, i) => i !== idx),
    });
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !editingExp) return;
    const current = editingExp.technologies || [];
    if (!current.includes(techInput.trim())) {
      setEditingExp({
        ...editingExp,
        technologies: [...current, techInput.trim()],
      });
    }
    setTechInput("");
  };

  const handleRemoveTech = (t: string) => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      technologies: (editingExp.technologies || []).filter((item) => item !== t),
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.role?.trim() || !editingExp.company?.trim()) return;

    if (editingExp.id) {
      // Update
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Experience",
        id: editingExp.id,
        data: editingExp,
      });
      if (res.success) {
        success("Experience Saved", `${editingExp.role} at ${editingExp.company} updated.`);
        onUpdateExperience(
          experience.map((e) =>
            e.id === editingExp.id ? (editingExp as Experience) : e
          )
        );
      } else {
        error("Update Failed", res.error);
      }
    } else {
      // Create
      const res = await apiCall("createRecord", "POST", {
        sheetName: "Experience",
        data: editingExp,
      });
      if (res.success && res.data) {
        success("Experience Created", `${editingExp.company} added.`);
        onUpdateExperience([...experience, res.data]);
      } else {
        error("Create Failed", res.error);
      }
    }
    setIsModalOpen(false);
    setEditingExp(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "Experience",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Experience Removed", `${deleteTarget.company} record deleted.`);
      onUpdateExperience(experience.filter((e) => e.id !== deleteTarget.id));
    } else {
      error("Delete Failed", res.error);
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (exp: Experience) => {
    const newStatus = !exp.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "Experience",
      id: exp.id,
      published: newStatus,
    });
    if (res.success) {
      success(
        newStatus ? "Experience Published" : "Experience Unpublished",
        `${exp.company} is now ${newStatus ? "visible" : "hidden"}.`
      );
      onUpdateExperience(
        experience.map((e) => (e.id === exp.id ? { ...e, published: newStatus } : e))
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Experience Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage industry internships, engineering responsibilities, tech stacks, and timeline ordering.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List Cards */}
      <div className="space-y-4">
        {experience.map((exp, idx) => (
          <div
            key={exp.id}
            className="rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-lg flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-zinc-700 transition-all"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase text-brand-400">
                  {exp.company}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-mono text-zinc-400">{exp.type}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-mono text-zinc-500">{exp.period}</span>
              </div>

              <h3 className="text-lg font-bold font-display text-white">{exp.role}</h3>

              <ul className="space-y-1.5 text-xs text-zinc-300">
                {exp.description.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 self-start md:self-auto border-t md:border-t-0 pt-3 md:pt-0 border-zinc-800">
              <button
                onClick={() => togglePublish(exp)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                  exp.published
                    ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                    : "bg-zinc-800 text-zinc-500 border-zinc-700"
                }`}
              >
                {exp.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{exp.published ? "Published" : "Draft"}</span>
              </button>

              <button
                onClick={() => handleOpenEdit(exp)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white"
                title="Edit Experience"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDeleteTarget(exp)}
                className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300"
                title="Delete Experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#141417] border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <h3 className="text-lg font-bold font-display text-white">
              {editingExp.id ? "Edit Experience Entry" : "Add Experience Entry"}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    value={editingExp.company || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, company: e.target.value })
                    }
                    placeholder="e.g. Dinesh IT Systems"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    value={editingExp.role || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, role: e.target.value })
                    }
                    placeholder="e.g. Software Development Intern"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Time Period
                  </label>
                  <input
                    type="text"
                    value={editingExp.period || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, period: e.target.value })
                    }
                    placeholder="e.g. June 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    value={editingExp.type || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, type: e.target.value })
                    }
                    placeholder="e.g. Internship Protocol / Full-Time"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Responsibilities Bullets */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Responsibilities &amp; Achievements
                </label>
                <div className="space-y-2 mb-2">
                  {(editingExp.description || []).map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                      <span className="flex-1">{bullet}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(idx)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add responsibility bullet point..."
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddBullet();
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddBullet}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white"
                  >
                    Add Bullet
                  </button>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Technologies
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(editingExp.technologies || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-brand-400 font-mono text-xs"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="text-zinc-500 hover:text-white ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technology..."
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingExp.published !== false}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        published: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-brand-500"
                  />
                  <span>Publish to Public Experience Section</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-brand-500 hover:bg-brand-400 shadow-md shadow-brand-500/20"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Experience"
        message={`Delete ${deleteTarget?.role} at ${deleteTarget?.company}?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
