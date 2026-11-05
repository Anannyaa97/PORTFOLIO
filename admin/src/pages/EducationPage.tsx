import React, { useState } from "react";
import { Education } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { Plus, GraduationCap, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

interface EducationPageProps {
  education: Education[];
  onUpdateEducation: (edu: Education[]) => void;
}

export const EducationPage: React.FC<EducationPageProps> = ({
  education,
  onUpdateEducation,
}) => {
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const { success, error } = useToast();

  const handleOpenCreate = () => {
    setEditingEdu({
      institution: "",
      degree: "B.Tech",
      field: "Computer Science and Engineering (Data Science)",
      period: "2024 - 2028",
      grade: "CGPA: 8.6 / 10",
      badge: "Expected 2028",
      order: education.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu({ ...edu });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu || !editingEdu.institution?.trim()) return;

    if (editingEdu.id) {
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Education",
        id: editingEdu.id,
        data: editingEdu,
      });
      if (res.success) {
        success("Education Saved", `${editingEdu.institution} updated.`);
        onUpdateEducation(
          education.map((e) => (e.id === editingEdu.id ? (editingEdu as Education) : e))
        );
      } else {
        error("Update Failed", res.error);
      }
    } else {
      const res = await apiCall("createRecord", "POST", {
        sheetName: "Education",
        data: editingEdu,
      });
      if (res.success && res.data) {
        success("Education Created", `${editingEdu.institution} added.`);
        onUpdateEducation([...education, res.data]);
      } else {
        error("Create Failed", res.error);
      }
    }
    setIsModalOpen(false);
    setEditingEdu(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "Education",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Education Deleted", `${deleteTarget.institution} removed.`);
      onUpdateEducation(education.filter((e) => e.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (edu: Education) => {
    const newStatus = !edu.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "Education",
      id: edu.id,
      published: newStatus,
    });
    if (res.success) {
      success("Status Updated", `${edu.institution} is now ${newStatus ? "published" : "hidden"}.`);
      onUpdateEducation(
        education.map((e) => (e.id === edu.id ? { ...e, published: newStatus } : e))
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Education Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Academic degrees, institutions, graduation dates, and performance standing.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-brand-400 font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 border border-brand-500/30">
                  {edu.badge || edu.period}
                </span>
                <button
                  onClick={() => togglePublish(edu)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                    edu.published
                      ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                      : "bg-zinc-800 text-zinc-500 border-zinc-700"
                  }`}
                >
                  {edu.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{edu.published ? "Published" : "Draft"}</span>
                </button>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">
                {edu.degree} in {edu.field}
              </h4>
              <p className="text-xs text-zinc-400 mt-1">{edu.institution}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-brand-400 font-bold">{edu.grade}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(edu)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(edu)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingEdu.id ? "Edit Education" : "Add Education"}
            </h3>
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Institution *
                </label>
                <input
                  type="text"
                  value={editingEdu.institution || ""}
                  onChange={(e) =>
                    setEditingEdu({ ...editingEdu, institution: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={editingEdu.degree || ""}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, degree: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Field / Specialization
                  </label>
                  <input
                    type="text"
                    value={editingEdu.field || ""}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, field: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={editingEdu.period || ""}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, period: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Grade / CGPA
                  </label>
                  <input
                    type="text"
                    value={editingEdu.grade || ""}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, grade: e.target.value })
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
        title="Delete Education Entry"
        message={`Delete ${deleteTarget?.institution}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
