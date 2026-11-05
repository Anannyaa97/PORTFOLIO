import React, { useState } from "react";
import { Project, MediaItem } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { MediaPickerModal } from "../components/MediaPickerModal";
import {
  Plus,
  Search,
  FolderGit2,
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface ProjectsPageProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  mediaItems: MediaItem[];
}

const VISUAL_TYPES: Project["visualType"][] = [
  "chart",
  "terminal",
  "hotel",
  "hardware",
  "web",
  "migration",
];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onUpdateProjects,
  mediaItems,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [techInput, setTechInput] = useState("");
  const { success, error } = useToast();

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingProject({
      title: "",
      category: "Big Data & Distributed Computing",
      description: "",
      shortDescription: "",
      technologies: ["Python"],
      githubUrl: "",
      liveUrl: "",
      thumbnailUrl: "",
      visualType: "chart",
      statLabel: "Engine",
      statValue: "",
      featured: false,
      order: projects.length + 1,
      published: true,
    });
    setTechInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setTechInput("");
    setIsModalOpen(true);
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !editingProject) return;
    const current = editingProject.technologies || [];
    if (!current.includes(techInput.trim())) {
      setEditingProject({
        ...editingProject,
        technologies: [...current, techInput.trim()],
      });
    }
    setTechInput("");
  };

  const handleRemoveTech = (tag: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: (editingProject.technologies || []).filter((t) => t !== tag),
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title?.trim()) return;

    if (editingProject.id) {
      // Update
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Projects",
        id: editingProject.id,
        data: editingProject,
      });
      if (res.success) {
        success("Project Saved", `${editingProject.title} updated in database.`);
        onUpdateProjects(
          projects.map((p) =>
            p.id === editingProject.id ? (editingProject as Project) : p
          )
        );
      } else {
        error("Update Failed", res.error);
      }
    } else {
      // Create
      const res = await apiCall("createRecord", "POST", {
        sheetName: "Projects",
        data: editingProject,
      });
      if (res.success && res.data) {
        success("Project Created", `${editingProject.title} added to portfolio.`);
        onUpdateProjects([...projects, res.data]);
      } else {
        error("Create Failed", res.error);
      }
    }
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "Projects",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Project Deleted", `${deleteTarget.title} removed.`);
      onUpdateProjects(projects.filter((p) => p.id !== deleteTarget.id));
    } else {
      error("Delete Failed", res.error);
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (project: Project) => {
    const newStatus = !project.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "Projects",
      id: project.id,
      published: newStatus,
    });
    if (res.success) {
      success(
        newStatus ? "Project Published" : "Project Unpublished",
        `${project.title} is now ${newStatus ? "live" : "draft"}.`
      );
      onUpdateProjects(
        projects.map((p) => (p.id === project.id ? { ...p, published: newStatus } : p))
      );
    } else {
      error("Status Update Failed", res.error);
    }
  };

  const toggleFeatured = async (project: Project) => {
    const newFeatured = !project.featured;
    const res = await apiCall("updateRecord", "POST", {
      sheetName: "Projects",
      id: project.id,
      data: { featured: newFeatured },
    });
    if (res.success) {
      success("Featured Updated", `${project.title} featured status changed.`);
      onUpdateProjects(
        projects.map((p) => (p.id === project.id ? { ...p, featured: newFeatured } : p))
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Projects Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage showcase engineering projects, GitHub repositories, live demo URLs, and visual badges.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
        <input
          type="text"
          placeholder="Search projects by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Projects Table */}
      <div className="rounded-3xl bg-[#141417] border border-zinc-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-mono uppercase text-zinc-400 bg-zinc-900/50">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Visual Type</th>
                <th className="py-3 px-4">Links</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No projects found.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, idx) => (
                  <tr key={project.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-500">
                      #{project.order || idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{project.title}</div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-xs mt-0.5">
                        {project.shortDescription || project.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-brand-400 font-mono text-[11px]">
                      {project.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 uppercase">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {project.visualType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-zinc-800 hover:text-brand-400 transition-colors"
                            title="GitHub Repo"
                          >
                            <FolderGit2 className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-brand-500/10 text-brand-400 hover:text-brand-300 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleFeatured(project)}
                        className={`p-1 rounded-lg transition-colors ${
                          project.featured ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${project.featured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePublish(project)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border transition-all ${
                          project.published
                            ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                            : "bg-zinc-800 text-zinc-500 border-zinc-700"
                        }`}
                      >
                        {project.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{project.published ? "Published" : "Draft"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Project"
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
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#141417] border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <h3 className="text-lg font-bold font-display text-white">
              {editingProject.id ? `Edit ${editingProject.title}` : "Create New Engineering Project"}
            </h3>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={editingProject.category || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    placeholder="e.g. Big Data, Security, Database"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Full Technical Description *
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 resize-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Short Description (Card Teaser)
                </label>
                <input
                  type="text"
                  value={editingProject.shortDescription || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Visual Preview Style
                  </label>
                  <select
                    value={editingProject.visualType || "chart"}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        visualType: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {VISUAL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Card Metric Badge (e.g. Engine / Storage)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={editingProject.statLabel || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          statLabel: e.target.value,
                        })
                      }
                      className="w-1/3 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. PySpark + HDFS)"
                      value={editingProject.statValue || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          statValue: e.target.value,
                        })
                      }
                      className="w-2/3 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Technologies Tags Input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(editingProject.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-brand-400 font-mono text-xs"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
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
                    placeholder="Add technology (e.g. PySpark, MySQL, Docker)..."
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
                    Add
                  </button>
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, liveUrl: e.target.value })
                    }
                    placeholder="https://...onrender.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingProject.featured || false}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        featured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-brand-500"
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingProject.published !== false}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        published: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-brand-500"
                  />
                  <span>Publish to Public Portfolio</span>
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
