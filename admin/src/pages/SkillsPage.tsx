import React, { useState } from "react";
import { Skill } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Wrench,
  CheckCircle2,
} from "lucide-react";

interface SkillsPageProps {
  skills: Skill[];
  onUpdateSkills: (skills: Skill[]) => void;
}

const CATEGORIES = [
  "All Categories",
  "Programming Languages",
  "Databases & Storage",
  "Data Analysis & ML",
  "Web Technologies",
  "Development Tools",
  "CS Fundamentals",
];

export const SkillsPage: React.FC<SkillsPageProps> = ({ skills, onUpdateSkills }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const { success, error } = useToast();

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "All Categories" || skill.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenCreate = () => {
    setEditingSkill({
      name: "",
      category: "Programming Languages",
      iconName: "Code",
      proficiency: 85,
      order: skills.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name?.trim()) return;

    if (editingSkill.id) {
      // Update
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Skills",
        id: editingSkill.id,
        data: editingSkill,
      });
      if (res.success) {
        success("Skill Updated", `${editingSkill.name} updated.`);
        onUpdateSkills(
          skills.map((s) => (s.id === editingSkill.id ? (editingSkill as Skill) : s))
        );
      } else {
        error("Update Failed", res.error);
      }
    } else {
      // Create
      const res = await apiCall("createRecord", "POST", {
        sheetName: "Skills",
        data: editingSkill,
      });
      if (res.success && res.data) {
        success("Skill Created", `${editingSkill.name} added to technical stack.`);
        onUpdateSkills([...skills, res.data]);
      } else {
        error("Create Failed", res.error);
      }
    }
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "Skills",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Skill Deleted", `${deleteTarget.name} removed.`);
      onUpdateSkills(skills.filter((s) => s.id !== deleteTarget.id));
    } else {
      error("Delete Failed", res.error);
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (skill: Skill) => {
    const newStatus = !skill.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "Skills",
      id: skill.id,
      published: newStatus,
    });
    if (res.success) {
      success(
        newStatus ? "Skill Published" : "Skill Unpublished",
        `${skill.name} is now ${newStatus ? "visible on" : "hidden from"} public portfolio.`
      );
      onUpdateSkills(
        skills.map((s) => (s.id === skill.id ? { ...s, published: newStatus } : s))
      );
    } else {
      error("Status Update Failed", res.error);
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const newSkills = [...skills];
    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;

    // Re-index orders
    newSkills.forEach((s, idx) => (s.order = idx + 1));
    onUpdateSkills(newSkills);

    await apiCall("reorderRecords", "POST", {
      sheetName: "Skills",
      orderedIds: newSkills.map((s) => s.id),
    });
    success("Order Updated", "Skills ordering synchronized.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Skills Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Create, categorize, reorder, and configure technical proficiencies across 6 competencies.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search skills by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table / Cards */}
      <div className="rounded-3xl bg-[#141417] border border-zinc-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-mono uppercase text-zinc-400 bg-zinc-900/50">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Skill Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Proficiency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No skills found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill, index) => (
                  <tr key={skill.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-500">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveOrder(index, "up")}
                          className="p-1 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === filteredSkills.length - 1}
                          onClick={() => handleMoveOrder(index, "down")}
                          className="p-1 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <span className="ml-1">#{skill.order || index + 1}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-400" />
                        {skill.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">
                      {skill.category}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-brand-400 rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-zinc-400">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePublish(skill)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border transition-all ${
                          skill.published
                            ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                            : "bg-zinc-800 text-zinc-500 border-zinc-700"
                        }`}
                      >
                        {skill.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{skill.published ? "Published" : "Draft"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Edit Skill"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(skill)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingSkill.id ? "Edit Technical Skill" : "Add New Skill"}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={editingSkill.name || ""}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, name: e.target.value })
                  }
                  placeholder="e.g. PySpark, PostgreSQL, React"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Category
                </label>
                <select
                  value={editingSkill.category}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Proficiency
                  </label>
                  <span className="font-mono text-xs text-brand-400 font-semibold">
                    {editingSkill.proficiency || 85}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={editingSkill.proficiency || 85}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      proficiency: Number(e.target.value),
                    })
                  }
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="skill-published"
                  checked={editingSkill.published !== false}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      published: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-brand-500 focus:ring-brand-500"
                />
                <label
                  htmlFor="skill-published"
                  className="text-xs text-zinc-300 select-none cursor-pointer"
                >
                  Publish immediately to public portfolio
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-brand-500 hover:bg-brand-400 shadow-md shadow-brand-500/20"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Skill"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This change will sync to your Google Sheets database.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
