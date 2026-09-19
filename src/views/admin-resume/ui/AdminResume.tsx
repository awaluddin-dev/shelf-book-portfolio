"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader } from "@/shared/ui/Loader";
import { AdminPageSkeleton } from "@/widgets/admin-page-skeleton/ui/AdminPageSkeleton";
import { useRouter } from "next/navigation";
import {
  FileText,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Trash2,
  Star,
  ExternalLink,
  Eye,
  Download,
  Calendar,
  HardDrive,
  X,
  Edit2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

interface ResumeDocument {
  id: string;
  title: string;
  description: string | null;
  fileType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminResume() {
  const [documents, setDocuments] = useState<ResumeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<ResumeDocument | null>(null);
  const [previewMdContent, setPreviewMdContent] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Edit Mode State
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/resume/documents");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setDocuments(result.data);
      } else if (Array.isArray(result)) {
        setDocuments(result);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch resume documents", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("isAdmin");
      router.push("/admin/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        router.push("/admin/login");
        return;
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      router.push("/admin/login");
      return;
    }

    if (localStorage.getItem("isAdmin") !== "true") {
      router.push("/admin/login");
      return;
    }

    fetchDocuments();
  }, [router, fetchDocuments]);

  // Load preview content if previewing markdown document
  useEffect(() => {
    if (!previewDoc) {
      queueMicrotask(() => setPreviewMdContent(null));
      return;
    }
    const isMd =
      previewDoc.fileType === "md" ||
      previewDoc.fileName.toLowerCase().endsWith(".md");

    if (isMd) {
      setLoadingPreview(true);
      fetch(`/api/resume/documents/${previewDoc.id}/download`)
        .then((res) => res.text())
        .then((text) => setPreviewMdContent(text))
        .catch(() => setPreviewMdContent("# Failed to load markdown content"))
        .finally(() => setLoadingPreview(false));
    } else {
      queueMicrotask(() => setPreviewMdContent(null));
    }
  }, [previewDoc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) {
        // Auto-generate title without extension
        const cleanName = selected.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName);
      }
    }
  };

  const startEdit = (doc: ResumeDocument) => {
    setEditingDocId(doc.id);
    setTitle(doc.title);
    setDescription(doc.description || "");
    setIsPrimary(doc.isPrimary);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingDocId(null);
    setTitle("");
    setDescription("");
    setIsPrimary(false);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const saveUpdatedDocument = async (id: string, token: string) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("isPrimary", String(isPrimary));

      const res = await fetch(`/api/resume/documents/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update document");
    } else {
      const res = await fetch(`/api/resume/documents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          isPrimary,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update document");
    }
  };

  const saveNewDocument = async (token: string) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("title", title.trim());
    if (description.trim()) {
      formData.append("description", description.trim());
    }
    formData.append("isPrimary", String(isPrimary));

    const res = await fetch("/api/resume/documents", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to upload document");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingDocId && !file) {
      showToast("Please select a file (.pdf or .md)", "error");
      return;
    }
    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }

    const token = localStorage.getItem("token") || "";
    setIsUploading(true);

    try {
      if (editingDocId) {
        await saveUpdatedDocument(editingDocId, token);
        showToast("Document updated successfully!", "success");
      } else {
        await saveNewDocument(token);
        showToast("Document uploaded successfully!", "success");
      }
      cancelEdit();
      fetchDocuments();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Operation failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (doc: ResumeDocument) => {
    const token = localStorage.getItem("token");
    setProcessingId(doc.id);
    try {
      const res = await fetch(`/api/resume/documents/${doc.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPrimary: true }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to set as primary");
      }

      showToast(`"${doc.title}" is now the primary resume!`, "success");
      fetchDocuments();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Action failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (doc: ResumeDocument) => {
    if (!confirm(`Are you sure you want to delete "${doc.title}"?`)) return;

    const token = localStorage.getItem("token");
    setProcessingId(doc.id);
    try {
      const res = await fetch(`/api/resume/documents/${doc.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete document");
      }

      showToast("Document deleted successfully", "success");
      if (previewDoc?.id === doc.id) {
        setPreviewDoc(null);
      }
      if (editingDocId === doc.id) {
        cancelEdit();
      }
      fetchDocuments();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Delete failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-xl backdrop-blur-md text-sm font-medium ${
              toastMessage.type === "success"
                ? "bg-status/15 border-status/30 text-status"
                : "bg-red-500/15 border-red-500/30 text-red-400"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {toastMessage.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary flex items-center gap-3">
            <span className="p-2 rounded-xl bg-status/10 text-status border border-status/20">
              <FileText size={24} />
            </span>
            Resume & CV Management
          </h1>
          <p className="text-secondary text-sm mt-1">
            Upload, update, and manage your CV / Resume documents (.pdf or .md) stored on the backend.
          </p>
        </div>

        <a
          href="/api/resume/documents/primary/download"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-subtle bg-card text-primary text-sm font-medium hover:border-status/50 hover:text-status transition-colors"
        >
          <ExternalLink size={16} />
          View Live Primary CV
        </a>
      </div>

      {/* Main Grid: Upload/Edit Form + Document List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-2xl border border-subtle p-6 bg-card/60 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-display text-primary flex items-center gap-2">
                {editingDocId ? (
                  <>
                    <Edit2 size={20} className="text-brand" />
                    <span>Update Document</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={20} className="text-status" />
                    <span>Upload New Document</span>
                  </>
                )}
              </h2>
              {editingDocId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs font-mono text-muted hover:text-primary transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Dropzone / Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                  {editingDocId ? "Replace File (.pdf, .md) (Optional)" : "Select File (.pdf, .md) *"}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    file
                      ? "border-status bg-status/5 text-status"
                      : "border-subtle hover:border-status/50 bg-subtle/10"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.md,application/pdf,text/markdown,text/plain"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText
                      size={32}
                      className={file ? "text-status" : "text-muted"}
                    />
                    {file ? (
                      <div className="text-left w-full truncate text-center">
                        <p className="text-sm font-semibold text-primary truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-primary">
                          {editingDocId ? "Click to select replacement file" : "Click to browse or drop document"}
                        </p>
                        <p className="text-xs text-muted font-mono">
                          PDF or Markdown (.pdf, .md)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Awaluddin - Senior Fullstack CV (2026)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-subtle text-primary placeholder:text-muted focus:outline-none focus:border-status text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                  Description / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tailored for backend, cloud & AI engineering roles"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-subtle text-primary placeholder:text-muted focus:outline-none focus:border-status text-sm resize-none"
                />
              </div>

              {/* Is Primary Checkbox */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-subtle/20 border border-subtle cursor-pointer hover:bg-subtle/30 transition-colors">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded border-subtle text-status focus:ring-status/30 accent-[#10b981]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-primary block">
                    Set as Primary Resume
                  </span>
                  <span className="text-muted">
                    This document will be prioritized for preview and download on the portfolio.
                  </span>
                </div>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading || (!editingDocId && !file)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-status hover:bg-[#059669] text-white font-semibold text-sm transition-colors shadow-lg shadow-status/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader size={18} />
                    <span>{editingDocId ? "Updating Document..." : "Uploading Document..."}</span>
                  </>
                ) : (
                  <>
                    {editingDocId ? <RefreshCw size={18} /> : <UploadCloud size={18} />}
                    <span>{editingDocId ? "Save Document Changes" : "Upload & Save Document"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Documents List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-primary flex items-center gap-2">
              <HardDrive size={18} className="text-status" />
              Uploaded Documents ({documents.length})
            </h2>
            <span className="text-xs font-mono text-muted">
              Fastify Storage: /uploads/documents
            </span>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-16 px-6 glass-card rounded-2xl border border-dashed border-subtle">
              <FileText size={48} className="mx-auto text-muted/50 mb-3" />
              <h3 className="text-base font-semibold text-primary">
                No documents uploaded yet
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                Upload your first CV or Resume using the form on the left. Once uploaded, it can be set as primary, updated, and previewed immediately.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    doc.isPrimary
                      ? "bg-status/5 border-status/40 shadow-sm"
                      : "bg-card border-subtle hover:border-subtle-hover"
                  } ${editingDocId === doc.id ? "ring-2 ring-brand/50" : ""}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-primary text-base truncate">
                          {doc.title}
                        </span>
                        {doc.isPrimary && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-status/15 text-status border border-status/30">
                            <Star size={12} className="fill-status" />
                            Primary
                          </span>
                        )}
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-subtle text-secondary font-semibold">
                          {doc.fileType}
                        </span>
                      </div>

                      {doc.description && (
                        <p className="text-xs text-secondary leading-relaxed">
                          {doc.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs font-mono text-muted flex-wrap pt-1">
                        <span className="flex items-center gap-1">
                          <HardDrive size={13} />
                          {formatFileSize(doc.fileSize)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {formatDate(doc.createdAt)}
                        </span>
                        <span className="text-muted/60 truncate max-w-[200px]">
                          {doc.fileName}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Edit Button */}
                      <button
                        onClick={() => startEdit(doc)}
                        className={`p-2 rounded-xl border transition-colors ${
                          editingDocId === doc.id
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-subtle text-secondary hover:text-primary hover:border-subtle-hover"
                        }`}
                        title="Edit metadata or replace file"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* Set Primary Button */}
                      {!doc.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(doc)}
                          disabled={processingId === doc.id}
                          className="px-3 py-1.5 rounded-xl border border-subtle text-xs font-mono text-secondary hover:text-status hover:border-status/50 transition-colors flex items-center gap-1.5"
                          title="Set as active public resume"
                        >
                          <Star size={14} />
                          <span>Make Primary</span>
                        </button>
                      )}

                      {/* Preview Button */}
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-2 rounded-xl border border-subtle text-secondary hover:text-primary hover:border-subtle-hover transition-colors"
                        title="Preview in modal"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Direct Download/View Link */}
                      <a
                        href={`/api/resume/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noreferrer noopener"
                        download={doc.fileName}
                        className="p-2 rounded-xl border border-subtle text-secondary hover:text-primary hover:border-subtle-hover transition-colors"
                        title="Open file in new tab"
                      >
                        <Download size={16} />
                      </a>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(doc)}
                        disabled={processingId === doc.id}
                        className="p-2 rounded-xl border border-subtle text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                        title="Delete document"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewDoc(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl h-[88vh] bg-canvas border border-subtle rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-subtle bg-card/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-status/10 text-status">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm sm:text-base flex items-center gap-2">
                      {previewDoc.title}
                      {previewDoc.isPrimary && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status/15 text-status border border-status/30">
                          Primary
                        </span>
                      )}
                    </h3>
                    <p className="text-xs font-mono text-muted">
                      {previewDoc.fileName} • {formatFileSize(previewDoc.fileSize)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/api/resume/documents/${previewDoc.id}/download`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-2 rounded-xl border border-subtle text-secondary hover:text-primary transition-colors flex items-center gap-1 text-xs font-mono"
                    title="Open in new window"
                  >
                    <ExternalLink size={15} />
                    <span className="hidden sm:inline">Open Tab</span>
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-2 rounded-xl border border-subtle text-muted hover:text-primary hover:bg-subtle/30 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Content: iFrame or Markdown Preview */}
              <div className="flex-1 w-full bg-subtle/20 relative overflow-y-auto">
                {previewDoc.fileType === "md" || previewDoc.fileName.toLowerCase().endsWith(".md") ? (
                  <div className="p-6 sm:p-10 max-w-4xl mx-auto bg-canvas min-h-full my-4 rounded-xl border border-subtle">
                    {loadingPreview ? (
                      <div className="flex items-center justify-center py-20 text-muted font-mono text-sm">
                        Loading Markdown...
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                        <ReactMarkdown>{previewMdContent || ""}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                ) : (
                  <iframe
                    src={`/api/resume/documents/${previewDoc.id}/download`}
                    className="w-full h-full border-none"
                    title={previewDoc.title}
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
