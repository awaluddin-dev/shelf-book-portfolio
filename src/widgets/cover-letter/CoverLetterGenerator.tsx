"use client";

import { useState, useRef, useEffect } from "react";
import { useCoverLetter } from "@/hooks/useCoverLetter";
import { usePortfolioStore } from "@/shared/store/portfolioStore";

const MIN_JD_LENGTH = 10;

export function CoverLetterGenerator({
  onClose,
}: Readonly<{ onClose?: () => void }>) {
  const {
    coverLetterJobDesc: jobDescription,
    setCoverLetterJobDesc: setJobDescription,
    setShowInquiryModal,
    setDraftInquirySource,
    setShowConnectionTooltip,
    setCoverLetterText,
    setCoverLetterStatus,
    setCoverLetterError,
  } = usePortfolioStore();

  const [copied, setCopied] = useState(false);
  const [isJdExpanded, setIsJdExpanded] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const { text, status, error, generate, reset } = useCoverLetter();

  const isActive = status === "loading" || status === "streaming";
  const hasOutput = status !== "idle";
  const canSubmit = jobDescription.trim().length >= MIN_JD_LENGTH && !isActive;

  function handleTryAnother() {
    setJobDescription("");
    setCoverLetterText("");
    setCoverLetterError(null);
    setCoverLetterStatus("idle");
  }

  // Auto-scroll output as text streams in
  useEffect(() => {
    if (status === "streaming" && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [text, status]);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    reset();
    handleTryAnother();
  }

  const handleDraftInquiry = () => {
    setDraftInquirySource(text);
    setShowInquiryModal(true);
    onClose?.();
  };

  const handleDownloadPDF = () => {
    // Create a hidden iframe to prevent 'about:blank' new tab
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      iframe.remove();
      alert("Failed to generate PDF.");
      return;
    }

    doc.open();
    doc.head.innerHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cover Letter - Awaluddin</title>
          <style>
            @page { margin: 2cm; }
            body { 
              font-family: 'Times New Roman', serif; 
              line-height: 1.6; 
              font-size: 12pt; 
              color: black; 
              margin: 0;
              padding: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 2rem;
            }
            .header h1 {
              margin: 0 0 0.25rem 0;
              font-size: 24pt;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .header p {
              margin: 0.25rem 0;
              font-size: 11pt;
              color: #444;
            }
            .content {
              white-space: pre-wrap;
              text-align: justify;
            }
            hr {
              border: 0;
              border-bottom: 1px solid #000;
              margin-top: 1.5rem;
              margin-bottom: 1.5rem;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Awaluddin</h1>
            <p>Backend Engineer & AI Integrator</p>
            <p>Jakarta, Indonesia | github.com/awaluddin-dev | linkedin.com/in/awaluddin-developer</p>
            <hr />
          </div>
          <div class="content">${text}</div>
        </body>
      </html>
    `;
    doc.close();

    // Give browser time to parse the HTML before triggering print
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Clean up iframe after a delay to ensure print dialogue has opened
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          iframe.remove();
        }
      }, 5000);
    }, 250);
  };

  const handleConnectSocials = () => {
    setShowConnectionTooltip(true);
    onClose?.();
    setTimeout(() => {
      document
        .getElementById("connection-terminal")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <section className="mx-auto w-full max-w-2xl space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-neu-text">
          Cover Letter Generator
        </h2>
        <p className="mt-1 text-sm text-neu-text-muted">
          Paste a job description and get a tailored cover letter based on my
          actual experience.
        </p>
      </div>

      {/* Input area — hide after generation starts */}
      {!hasOutput && (
        <div className="space-y-3">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="w-full resize-none rounded-lg border border-neu-accent/20 bg-neu-bg/50 px-4 py-3 text-sm text-neu-text placeholder-neu-text-muted outline-none transition-colors focus:border-neu-accent focus:bg-neu-bg"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-neu-text-muted">
              {jobDescription.trim().length < MIN_JD_LENGTH
                ? `${MIN_JD_LENGTH - jobDescription.trim().length} more characters needed`
                : `${jobDescription.trim().length} characters`}
            </span>
            <button
              type="button"
              onClick={() => generate(jobDescription)}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-md bg-neu-accent px-4 py-2 text-sm font-medium text-neu-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <SparkleIcon className="h-4 w-4" />
              Generate Cover Letter
            </button>
          </div>
        </div>
      )}

      {/* Output panel */}
      {hasOutput && (
        <div className="rounded-lg border border-neu-accent/20 bg-neu-bg/50">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-neu-accent/20 px-4 py-3">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neu-text-muted">
              <SparkleIcon className="h-3.5 w-3.5" />
              {status === "loading" && "Preparing..."}
              {status === "streaming" && "Writing..."}
              {status === "done" && "Cover Letter"}
              {status === "error" && "Error"}
            </span>
            <div className="flex items-center gap-2">
              {status === "done" && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs text-neu-text-muted transition-colors hover:bg-neu-accent/10 hover:text-neu-text"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                disabled={isActive}
                aria-label="Start over"
                className="rounded p-1 text-neu-text-muted transition-colors hover:text-neu-text hover:bg-neu-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div ref={outputRef} className="max-h-96 overflow-y-auto px-4 py-4">
            {status === "loading" && (
              <div className="flex items-center gap-2 text-sm text-neu-text-muted">
                <span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-neu-accent">
                  Crafting a tailored cover letter based on Awaluddin&apos;s
                  experience...
                </span>
              </div>
            )}

            {(status === "streaming" || status === "done") && (
              <div className="relative" id="cover-letter-print-area">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-neu-text print-text">
                  {text}
                </p>
                {status === "streaming" && (
                  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-neu-accent align-middle" />
                )}
              </div>
            )}

            {status === "error" && (
              <div className="space-y-2">
                <p className="text-sm text-red-400">
                  {error ?? "Something went wrong. Please try again."}
                </p>
                <button
                  type="button"
                  onClick={() => generate(jobDescription)}
                  className="text-xs text-neu-text-muted underline underline-offset-2 hover:text-neu-text"
                >
                  Try again
                </button>
              </div>
            )}
          </div>

          {/* Footer — show full JD with a scrollable area */}
          {status === "done" && (
            <div className="border-t border-neu-accent/20 bg-white/5 print-hide">
              <div className="px-4 py-3 border-b border-neu-accent/10">
                <button
                  type="button"
                  onClick={() => setIsJdExpanded(!isJdExpanded)}
                  className="flex items-center gap-2 text-xs font-semibold text-neu-text w-full text-left outline-none hover:text-neu-accent transition-colors"
                >
                  Generated for Job Description:
                  <ChevronIcon
                    className={`h-3 w-3 text-neu-text-muted transition-transform duration-200 ${isJdExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isJdExpanded && (
                  <div className="mt-2 max-h-24 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    <p className="text-[11px] leading-relaxed text-neu-text-muted whitespace-pre-wrap">
                      {jobDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="px-4 py-4 bg-neu-bg/50">
                <p className="text-xs font-semibold text-neu-text mb-3 text-center">
                  What&apos;s next?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={handleDraftInquiry}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-neu-accent/10 hover:bg-neu-accent/20 border border-neu-accent/30 text-neu-accent transition-colors"
                  >
                    <MailIcon className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
                      Draft Inquiry
                    </span>
                  </button>

                  <a
                    href="https://calendly.com/hello-awaluddin/developer-talk-hiring"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neu-text transition-colors"
                  >
                    <CalendarIcon className="h-4 w-4 text-neu-text-muted" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight text-neu-text-muted">
                      Schedule Call
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neu-text transition-colors"
                  >
                    <DownloadIcon className="h-4 w-4 text-neu-text-muted" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight text-neu-text-muted">
                      Save PDF
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConnectSocials}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neu-text transition-colors"
                  >
                    <TerminalIcon className="h-4 w-4 text-neu-text-muted" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight text-neu-text-muted">
                      Connect
                    </span>
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleTryAnother}
                    className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neu-text transition-colors group"
                  >
                    <RefreshIcon className="h-4 w-4 text-neu-text-muted group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight text-neu-text-muted">
                      Try Another Job Desk
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ── Inline icons ──────────────────────────────────────────────────────────────

function SparkleIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function CopyIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
  );
}

function CheckIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function CloseIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function MailIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function CalendarIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function DownloadIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function TerminalIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function RefreshIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}
