import React, { useState } from "react";
import { Certificate, MediaItem } from "../types";
import { apiCall } from "../services/api";
import { useToast } from "../context/ToastContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { MediaPickerModal } from "../components/MediaPickerModal";
import { Plus, Award, ExternalLink, Edit2, Trash2, Eye, EyeOff, FileText } from "lucide-react";

interface CertificatesPageProps {
  certificates: Certificate[];
  onUpdateCertificates: (certs: Certificate[]) => void;
  mediaItems: MediaItem[];
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({
  certificates,
  onUpdateCertificates,
  mediaItems,
}) => {
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const { success, error } = useToast();

  const handleOpenCreate = () => {
    setEditingCert({
      title: "",
      issuer: "Spoken Tutorial, IIT Bombay",
      issueYear: "2025",
      credentialUrl: "",
      fileUrl: "",
      order: certificates.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert({ ...cert });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title?.trim()) return;

    if (editingCert.id) {
      const res = await apiCall("updateRecord", "POST", {
        sheetName: "Certificates",
        id: editingCert.id,
        data: editingCert,
      });
      if (res.success) {
        success("Certificate Saved", `${editingCert.title} updated.`);
        onUpdateCertificates(
          certificates.map((c) =>
            c.id === editingCert.id ? (editingCert as Certificate) : c
          )
        );
      } else {
        error("Update Failed", res.error);
      }
    } else {
      const res = await apiCall("createRecord", "POST", {
        sheetName: "Certificates",
        data: editingCert,
      });
      if (res.success && res.data) {
        success("Certificate Added", `${editingCert.title} created.`);
        onUpdateCertificates([...certificates, res.data]);
      } else {
        error("Create Failed", res.error);
      }
    }
    setIsModalOpen(false);
    setEditingCert(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await apiCall("deleteRecord", "POST", {
      sheetName: "Certificates",
      id: deleteTarget.id,
    });
    if (res.success) {
      success("Certificate Removed", `${deleteTarget.title} deleted.`);
      onUpdateCertificates(certificates.filter((c) => c.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const togglePublish = async (cert: Certificate) => {
    const newStatus = !cert.published;
    const res = await apiCall("publishContent", "POST", {
      sheetName: "Certificates",
      id: cert.id,
      published: newStatus,
    });
    if (res.success) {
      success("Status Updated", `${cert.title} publication state toggled.`);
      onUpdateCertificates(
        certificates.map((c) =>
          c.id === cert.id ? { ...c, published: newStatus } : c
        )
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Certificates Management</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Verified academic credentials, issuing bodies (IIT Bombay, NPTEL), and verification URLs.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-brand-400 font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 border border-brand-500/30">
                  {cert.issueYear}
                </span>
                <button
                  onClick={() => togglePublish(cert)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                    cert.published
                      ? "bg-brand-500/15 text-brand-400 border-brand-500/30"
                      : "bg-zinc-800 text-zinc-500 border-zinc-700"
                  }`}
                >
                  {cert.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{cert.published ? "Published" : "Draft"}</span>
                </button>
              </div>

              <h4 className="text-base font-bold text-white">{cert.title}</h4>
              <p className="text-xs text-zinc-400 mt-1">{cert.issuer}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-400 hover:underline font-mono"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(cert)}
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
      {isModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#141417] border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingCert.id ? "Edit Certificate" : "Add Certificate"}
            </h3>
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Certificate Name *
                </label>
                <input
                  type="text"
                  value={editingCert.title || ""}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, title: e.target.value })
                  }
                  placeholder="e.g. Python for Data Science"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={editingCert.issuer || ""}
                  onChange={(e) =>
                    setEditingCert({ ...editingCert, issuer: e.target.value })
                  }
                  placeholder="e.g. NPTEL / IIT Bombay"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Issue Year
                  </label>
                  <input
                    type="text"
                    value={editingCert.issueYear || ""}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, issueYear: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Verification URL
                  </label>
                  <input
                    type="url"
                    value={editingCert.credentialUrl || ""}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, credentialUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Certificate File (PDF or Image)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCert.fileUrl || ""}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, fileUrl: e.target.value })
                    }
                    placeholder="File URL..."
                    className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-400" />
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
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        allowedCategory="Documents"
        mediaItems={mediaItems}
        onSelectUrl={(url) => {
          if (editingCert) setEditingCert({ ...editingCert, fileUrl: url });
        }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Certificate"
        message={`Delete certificate "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
