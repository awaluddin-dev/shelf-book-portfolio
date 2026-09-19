"use client";

import { RefObject } from "react";
import {
  FileText,
  UploadCloud,
  Edit2,
  RefreshCw,
  Star,
  HardDrive,
  Calendar,
  Eye,
  Download,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Loader } from "@/shared/ui/Loader";

export interface ResumeDocument {
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

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const formatDate = (dateStr: string) => {
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

interface ResumeUploadFormProps {
  editingDocId: string | null;
  file: File | null;
  title: string;
  description: string;
  isPrimary: boolean;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onPrimaryChange: (v: boolean) => void;
  onCancelEdit: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ResumeUploadForm({
  editingDocId,
  file,
  title,
  description,
  isPrimary,
  isUploading,
  fileInputRef,
  onFileChange,
  onTitleChange,
  onDescriptionChange,
  onPrimaryChange,
  onCancelEdit,
  onSubmit,
}: ResumeUploadFormProps) {
  return (
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
            onClick={onCancelEdit}
            className="text-xs font-mono text-muted hover:text-primary transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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
              onChange={onFileChange}
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

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
            Document Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Awaluddin - Senior Fullstack CV (2026)"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-subtle text-primary placeholder:text-muted focus:outline-none focus:border-status text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
            Description / Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Tailored for backend, cloud & AI engineering roles"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-subtle text-primary placeholder:text-muted focus:outline-none focus:border-status text-sm resize-none"
          />
        </div>

        <label className="flex items-center gap-3 p-3 rounded-xl bg-subtle/20 border border-subtle cursor-pointer hover:bg-subtle/30 transition-colors">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => onPrimaryChange(e.target.checked)}
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
  );
}

interface ResumeDocumentCardProps {
  doc: ResumeDocument;
  isEditing: boolean;
  isProcessing: boolean;
  onStartEdit: (doc: ResumeDocument) => void;
  onSetPrimary: (doc: ResumeDocument) => void;
  onPreview: (doc: ResumeDocument) => void;
  onDelete: (doc: ResumeDocument) => void;
}

export function ResumeDocumentCard({
  doc,
  isEditing,
  isProcessing,
  onStartEdit,
  onSetPrimary,
  onPreview,
  onDelete,
}: ResumeDocumentCardProps) {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        doc.isPrimary
          ? "bg-status/5 border-status/40 shadow-sm"
          : "bg-card border-subtle hover:border-subtle-hover"
      } ${isEditing ? "ring-2 ring-brand/50" : ""}`}
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

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => onStartEdit(doc)}
            className={`p-2 rounded-xl border transition-colors ${
              isEditing
                ? "border-brand bg-brand/10 text-brand"
                : "border-subtle text-secondary hover:text-primary hover:border-subtle-hover"
            }`}
            title="Edit metadata or replace file"
          >
            <Edit2 size={16} />
          </button>

          {!doc.isPrimary && (
            <button
              onClick={() => onSetPrimary(doc)}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-xl border border-subtle text-xs font-mono text-secondary hover:text-status hover:border-status/50 transition-colors flex items-center gap-1.5"
              title="Set as active public resume"
            >
              <Star size={14} />
              <span>Make Primary</span>
            </button>
          )}

          <button
            onClick={() => onPreview(doc)}
            className="p-2 rounded-xl border border-subtle text-secondary hover:text-primary hover:border-subtle-hover transition-colors"
            title="Preview in modal"
          >
            <Eye size={16} />
          </button>

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

          <button
            onClick={() => onDelete(doc)}
            disabled={isProcessing}
            className="p-2 rounded-xl border border-subtle text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
            title="Delete document"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ResumePreviewModalProps {
  previewDoc: ResumeDocument | null;
  previewMdContent: string | null;
  loadingPreview: boolean;
  onClose: () => void;
}

export function ResumePreviewModal({
  previewDoc,
  previewMdContent,
  loadingPreview,
  onClose,
}: ResumePreviewModalProps) {
  return (
    <AnimatePresence>
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-5xl h-[88vh] bg-canvas border border-subtle rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
          >
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
                  onClick={onClose}
                  className="p-2 rounded-xl border border-subtle text-muted hover:text-primary hover:bg-subtle/30 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

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
  );
}
