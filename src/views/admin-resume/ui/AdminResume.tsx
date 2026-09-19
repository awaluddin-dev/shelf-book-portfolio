"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AdminPageSkeleton } from "@/widgets/admin-page-skeleton/ui/AdminPageSkeleton";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResumeDocument,
  ResumeUploadForm,
  ResumeDocumentCard,
  ResumePreviewModal,
} from "./AdminResumeComponents";

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

    queueMicrotask(() => {
      fetchDocuments();
    });
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
      queueMicrotask(() => setLoadingPreview(true));
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
        <div className="lg:col-span-5">
          <ResumeUploadForm
            editingDocId={editingDocId}
            file={file}
            title={title}
            description={description}
            isPrimary={isPrimary}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onPrimaryChange={setIsPrimary}
            onCancelEdit={cancelEdit}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Documents List */}
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
                <ResumeDocumentCard
                  key={doc.id}
                  doc={doc}
                  isEditing={editingDocId === doc.id}
                  isProcessing={processingId === doc.id}
                  onStartEdit={startEdit}
                  onSetPrimary={handleSetPrimary}
                  onPreview={setPreviewDoc}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <ResumePreviewModal
        previewDoc={previewDoc}
        previewMdContent={previewMdContent}
        loadingPreview={loadingPreview}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
