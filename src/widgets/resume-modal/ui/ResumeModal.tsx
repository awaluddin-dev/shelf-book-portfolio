"use client";

import { useEffect, useState } from "react";
import { usePortfolioStore } from "@/shared/store/portfolioStore";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  X,
  Download,
  Star,
  Layers,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export function ResumeModal() {
  const {
    showResumeModal,
    setShowResumeModal,
    primaryResume,
    resumeDocuments,
    fetchResumeDocuments,
  } = usePortfolioStore();

  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [mdContent, setMdContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // Refresh resume documents when modal opens
  useEffect(() => {
    if (showResumeModal) {
      fetchResumeDocuments();
    }
  }, [showResumeModal, fetchResumeDocuments]);

  // Set default active doc asynchronously to avoid cascading sync renders
  useEffect(() => {
    if (!showResumeModal) return;

    if (primaryResume?.id) {
      queueMicrotask(() => setActiveDocId(primaryResume.id));
    } else if (resumeDocuments.length > 0) {
      const primary = resumeDocuments.find((d: any) => d.isPrimary) || resumeDocuments[0];
      if (primary?.id) {
        queueMicrotask(() => setActiveDocId(primary.id));
      }
    }
  }, [showResumeModal, primaryResume, resumeDocuments]);

  // Find currently selected document
  const selectedDoc =
    resumeDocuments.find((d: any) => d.id === activeDocId) ||
    primaryResume ||
    (resumeDocuments.length > 0 ? resumeDocuments[0] : null);

  // Fetch markdown content if current selected is .md
  useEffect(() => {
    if (!selectedDoc) {
      queueMicrotask(() => setMdContent(null));
      return;
    }
    const isDocMd =
      selectedDoc.fileType === "md" ||
      selectedDoc.fileName?.toLowerCase().endsWith(".md") ||
      selectedDoc.mimeType?.includes("markdown");

    if (isDocMd) {
      queueMicrotask(() => setLoadingContent(true));
      fetch(`/api/resume/documents/${selectedDoc.id}/download`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load markdown");
          return res.text();
        })
        .then((text) => {
          setMdContent(text);
        })
        .catch((err) => {
          console.error("Failed to load markdown resume:", err);
          setMdContent("# Failed to load document\nPlease download or open in a new tab.");
        })
        .finally(() => setLoadingContent(false));
    } else {
      queueMicrotask(() => setMdContent(null));
    }
  }, [selectedDoc]);

  if (!showResumeModal) return null;

  // Fallback URL if no document has been uploaded yet
  const fallbackUrl = "/assets/resume/Awaluddin_cv.pdf";
  const resumeUrl = selectedDoc?.id
    ? `/api/resume/documents/${selectedDoc.id}/download`
    : fallbackUrl;

  const resumeTitle = selectedDoc?.title || "Curriculum Vitae - Awaluddin";
  const resumeFileName = selectedDoc?.fileName || "Awaluddin_cv.pdf";
  const isMd =
    selectedDoc?.fileType === "md" ||
    selectedDoc?.fileName?.toLowerCase().endsWith(".md");

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "";
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowResumeModal(false)}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl h-[92vh] bg-canvas border border-subtle rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-subtle bg-card/80 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-status/10 text-status border border-status/20 shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-primary text-sm sm:text-base truncate flex items-center gap-2">
                  <span>{resumeTitle}</span>
                  {selectedDoc?.isPrimary && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-status/15 text-status border border-status/30 shrink-0">
                      <Star size={10} className="fill-status" />
                      Primary
                    </span>
                  )}
                </h3>
                <p className="text-xs font-mono text-muted truncate">
                  {resumeFileName} {selectedDoc?.fileSize ? `• ${formatFileSize(selectedDoc.fileSize)}` : ""}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={resumeUrl}
                download={resumeFileName}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-subtle bg-subtle/20 text-xs font-mono text-secondary hover:text-primary hover:border-subtle-hover transition-colors"
                title="Download file directly"
              >
                <Download size={14} />
                <span>Download</span>
              </a>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-status/30 bg-status/10 text-status hover:bg-status hover:text-white transition-colors text-xs font-mono font-medium"
                title="Open file in new browser tab"
              >
                <ArrowUpRight size={14} />
                <span className="hidden sm:inline">Open in New Tab</span>
                <span className="sm:hidden">Open</span>
              </a>

              <button
                onClick={() => setShowResumeModal(false)}
                className="p-2 rounded-xl border border-subtle text-muted hover:text-primary hover:bg-subtle/30 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Body: 2 Columns if multiple documents, or single preview */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Sidebar: Document Switcher List (shown if > 1 documents uploaded) */}
            {resumeDocuments.length > 1 && (
              <div className="w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r border-subtle bg-card/40 flex flex-col shrink-0">
                <div className="p-3.5 border-b border-subtle flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted font-semibold flex items-center gap-1.5">
                    <Layers size={14} className="text-brand" />
                    Available Resumes ({resumeDocuments.length})
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-48 md:max-h-none">
                  {resumeDocuments.map((doc: any) => {
                    const isSelected = (selectedDoc?.id || activeDocId) === doc.id;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setActiveDocId(doc.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-status/10 border-status/40 text-primary shadow-sm"
                            : "bg-canvas/50 border-subtle/70 text-secondary hover:border-subtle-hover hover:text-primary"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-semibold text-xs truncate flex-1">
                            {doc.title}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-subtle text-secondary font-semibold shrink-0">
                            {doc.fileType || "PDF"}
                          </span>
                        </div>

                        {doc.description && (
                          <p className="text-[11px] text-muted line-clamp-1">
                            {doc.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] font-mono text-muted pt-0.5">
                          <span>{formatFileSize(doc.fileSize)}</span>
                          {doc.isPrimary && (
                            <span className="text-status flex items-center gap-0.5">
                              <Star size={10} className="fill-status" />
                              Primary
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Preview Pane */}
            <div className="flex-1 h-full bg-subtle/20 relative overflow-hidden flex flex-col">
              {/* Document Banner inside Preview */}
              <div className="px-5 py-2.5 bg-canvas/90 border-b border-subtle flex items-center justify-between text-xs font-mono text-muted">
                <div className="flex items-center gap-3 truncate">
                  <span className="font-semibold text-primary truncate">
                    {selectedDoc?.fileName || resumeFileName}
                  </span>
                  {selectedDoc?.createdAt && (
                    <span className="hidden sm:inline">
                      Updated: {formatDate(selectedDoc.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-status transition-colors flex items-center gap-1"
                  >
                    <span>Full Tab</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Document Renderer */}
              <div className="flex-1 w-full h-full relative overflow-y-auto">
                {(() => {
                  if (!isMd) {
                    return (
                      <iframe
                        src={resumeUrl}
                        className="w-full h-full border-none"
                        title={resumeTitle}
                      />
                    );
                  }

                  let markdownBody = (
                    <div className="text-muted text-center py-20">No content found.</div>
                  );
                  if (loadingContent) {
                    markdownBody = (
                      <div className="flex items-center justify-center py-20 text-muted font-mono text-sm">
                        Loading Markdown resume...
                      </div>
                    );
                  } else if (mdContent) {
                    markdownBody = (
                      <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold text-primary border-b border-subtle pb-3 mb-4">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-lg font-bold text-brand border-b border-subtle/50 pb-2 mt-6 mb-3">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-base font-semibold text-primary mt-4 mb-2">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => <p className="mb-3 text-secondary">{children}</p>,
                            ul: ({ children }) => (
                              <ul className="list-disc pl-5 space-y-1 mb-3 text-secondary">
                                {children}
                              </ul>
                            ),
                            li: ({ children }) => <li>{children}</li>,
                            strong: ({ children }) => (
                              <strong className="font-semibold text-primary">{children}</strong>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-brand hover:underline"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {mdContent}
                        </ReactMarkdown>
                      </div>
                    );
                  }

                  return (
                    <div className="p-6 sm:p-10 max-w-4xl mx-auto bg-canvas min-h-full my-4 rounded-xl border border-subtle shadow-sm">
                      {markdownBody}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ResumeModal;
