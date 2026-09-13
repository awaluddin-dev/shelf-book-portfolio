"use client";

import React from "react";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface ShelvedArticle {
  id: string;
  title: string;
  shelf: string;
  summary: string;
  url?: string;
  metrics?: string;
  status?: string;
  isDraft?: boolean;
}

export const SHELVED_ARTICLES: ShelvedArticle[] = [
  {
    id: "multi-provider-llm-router",
    title: "I Built a Multi-Provider LLM Router for My AI Worker",
    shelf: "AI Systems & Resilience",
    summary:
      "Mengapa sistem AI produksi membutuhkan multi-provider fallback (Gemini ➔ Groq ➔ Claude) tanpa redeploy, dan bagaimana memisahkan lifecycle gateway dari worker.",
    url: "https://dev.to/awaluddin/i-built-a-multi-provider-llm-router-for-my-ai-worker-heres-what-i-learned-l8d",
    metrics: "Featured on DEV Community · 290+ reads",
    status: "Published",
  },
  {
    id: "rewrite-fintech-platform",
    title: "I Rewrote a Fintech Platform Alone — No Handover, No Team, No Docs",
    shelf: "Engineering Reality & Resilience",
    summary:
      "Studi kasus nyata membongkar sistem finansial monolit tanpa dokumentasi, menjamin audit trail saldo, dan mencapai kepatuhan regulasi OJK & BI.",
    url: "https://dev.to/awaluddin",
    metrics: "560+ impressions",
    status: "Published",
  },
  {
    id: "hitl-async-queue",
    title: "I Added Human-in-the-Loop to an Async Queue System",
    shelf: "Distributed Queues & Automation",
    summary:
      "Pola arsitektur mengintegrasikan approval manusia ke dalam antrean BullMQ tanpa memblokir thread worker asinkron.",
    status: "[Drafting / Coming Soon]",
    isDraft: true,
  },
];

interface WritingSectionProps {
  isDark?: boolean;
}

export default function WritingSection({ isDark }: Readonly<WritingSectionProps>) {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex items-center gap-2 text-neu-accent">
          <BookOpen size={18} />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
            The Shelves
          </span>
        </div>
        <p className="text-xs text-neu-text-muted font-mono">
          ✦ Deep-dive technical essays, post-mortems, and architectural reflections.
        </p>
      </div>

      {/* Articles Grid / List */}
      <div className="flex flex-col gap-4">
        {SHELVED_ARTICLES.map((article) => {
          const CardContent = (
            <div
              className={cn(
                "group relative rounded-xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between gap-3.5 border",
                "bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700",
                article.isDraft && "opacity-85 hover:border-zinc-800 cursor-default",
              )}
            >
              <div>
                {/* Shelf Badge & Status indicator */}
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-zinc-800/70 text-zinc-300 border border-zinc-700/60">
                    <span className="text-neu-accent text-xs">§</span>
                    <span>[{article.shelf}]</span>
                  </div>

                  {article.isDraft ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400/90 font-medium">
                      <Clock size={12} />
                      <span>{article.status}</span>
                    </span>
                  ) : (
                    article.metrics && (
                      <span className="text-[11px] font-mono text-neu-text-muted">
                        {article.metrics}
                      </span>
                    )
                  )}
                </div>

                {/* Article Title */}
                <h3 className="text-base sm:text-lg font-display font-bold text-neu-text group-hover:text-neu-accent transition-colors flex items-start justify-between gap-2">
                  <span>{article.title}</span>
                  {!article.isDraft && (
                    <ArrowUpRight
                      size={18}
                      className="text-neu-text-muted group-hover:text-neu-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 mt-0.5"
                    />
                  )}
                </h3>

                {/* Summary */}
                <p className="mt-2 text-xs sm:text-sm text-neu-text-muted leading-relaxed font-normal">
                  {article.summary}
                </p>
              </div>

              {/* Action Prompt for Live Articles */}
              {!article.isDraft && (
                <div className="pt-1 flex items-center gap-1.5 text-xs font-mono font-semibold text-neu-accent group-hover:underline">
                  <span>Read full post on Dev.to</span>
                  <ArrowUpRight size={13} />
                </div>
              )}
            </div>
          );

          if (article.isDraft || !article.url) {
            return (
              <div key={article.id} className="relative">
                {CardContent}
              </div>
            );
          }

          return (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noreferrer noopener"
              className="block no-underline"
            >
              {CardContent}
            </a>
          );
        })}
      </div>

      {/* Dev.to Footer Link */}
      <div className="pt-2">
        <a
          href="https://dev.to/awaluddin"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-neu-accent hover:underline"
        >
          <span>Explore all technical notes on Dev.to</span>
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}
