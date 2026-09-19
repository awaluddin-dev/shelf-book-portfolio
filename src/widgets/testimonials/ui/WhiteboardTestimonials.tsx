"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { MessageSquare, Quote, ExternalLink } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { usePortfolioStore } from "@/shared/store/portfolioStore";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company?: string;
  relation?: string;
  testimonial: string;
  url?: string;
  quotePrefix?: string;
  highlight?: string;
  quoteSuffix?: string;
  rotationClass?: string;
}

export const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "daniel",
    name: "Daniel",
    role: "Integration Engineer",
    company: "Enterprise Client",
    relation: "Enterprise Client Collaborator",
    quotePrefix:
      "Awaluddin memiliki kemampuan luar biasa dalam membedah dependensi sistem legacy dan ",
    highlight: "kecepatan eksekusi API dan kontrak yang disiplin",
    quoteSuffix:
      ". Kerjasama integrasi berjalan sangat mulus berkat kontrak API yang disiplin.",
    testimonial:
      "Awaluddin memiliki kemampuan luar biasa dalam membedah dependensi sistem legacy dan kecepatan eksekusi API dan kontrak yang disiplin. Kerjasama integrasi berjalan sangat mulus berkat kontrak API yang disiplin.",
  },
  {
    id: "kemal",
    name: "Kemal",
    role: "Backend Engineer",
    company: "Tech Peer",
    relation: "Peer Collaborator",
    quotePrefix:
      "Sangat jarang melihat engineer yang sangat memikirkan edge-cases: dari ",
    highlight: "idempotency antrean hingga retry policy",
    quoteSuffix:
      ". Rekomendasi teknisnya selalu berlandaskan stabilitas jangka panjang sistem.",
    testimonial:
      "Sangat jarang melihat engineer yang sangat memikirkan edge-cases: dari idempotency antrean hingga retry policy. Rekomendasi teknisnya selalu berlandaskan stabilitas jangka panjang sistem.",
  },
  {
    id: "adimas",
    name: "Adimas",
    role: "Project Management Analyst",
    company: "Enterprise Delivery Team",
    relation: "Enterprise Delivery Team",
    quotePrefix:
      "Komunikasi teknisnya sangat jelas kepada tim produk. Ketika ada tantangan data drift antara ERP dan sistem baru, Awaluddin dapat memberikan ",
    highlight: "transparansi dan penyelesaian data drift tepat waktu",
    quoteSuffix: " dengan mitigasi risiko yang matang.",
    testimonial:
      "Komunikasi teknisnya sangat jelas kepada tim produk. Ketika ada tantangan data drift antara ERP dan sistem baru, Awaluddin dapat memberikan transparansi dan penyelesaian data drift tepat waktu dengan mitigasi risiko yang matang.",
  },
];

// Target engineering phrases to highlight if present in testimonial text
const TARGET_HIGHLIGHT_PHRASES = [
  "kecepatan eksekusi API dan kontrak yang disiplin",
  "idempotency antrean hingga retry policy",
  "transparansi dan penyelesaian data drift tepat waktu",
  "arsitektur sistem",
  "event-driven",
  "zero downtime",
  "high-concurrency",
  "idempotency",
  "audit trail",
  "clean architecture",
  "disiplin",
  "mitigasi risiko",
];

const ROTATION_CLASSES = [
  "rotate-0 md:-rotate-1 md:hover:rotate-0 transition-transform duration-200",
  "rotate-0 md:rotate-1 md:hover:rotate-0 transition-transform duration-200",
  "rotate-0 md:-rotate-0.5 md:hover:rotate-0 transition-transform duration-200",
];

interface WhiteboardTestimonialsProps {
  isDark?: boolean;
}

/**
 * Helper to render testimonial text with bold highlights for key technical phrases.
 */
function renderHighlightedText(item: TestimonialItem) {
  // If explicitly provided prefix/highlight/suffix, use them
  if (item.highlight && item.quotePrefix !== undefined) {
    return (
      <>
        &ldquo;{item.quotePrefix}
        <strong className="text-primary font-bold">{item.highlight}</strong>
        {item.quoteSuffix}&rdquo;
      </>
    );
  }

  const text = item.testimonial || "";
  for (const phrase of TARGET_HIGHLIGHT_PHRASES) {
    const idx = text.toLowerCase().indexOf(phrase.toLowerCase());
    if (idx !== -1) {
      const before = text.slice(0, idx);
      const matched = text.slice(idx, idx + phrase.length);
      const after = text.slice(idx + phrase.length);
      return (
        <>
          &ldquo;{before}
          <strong className="text-primary font-bold">{matched}</strong>
          {after}&rdquo;
        </>
      );
    }
  }

  return <>&ldquo;{text}&rdquo;</>;
}

export default function WhiteboardTestimonials({
  isDark,
}: Readonly<WhiteboardTestimonialsProps>) {
  const { testimonialsList, setSelectedTestimonial } = usePortfolioStore();

  const displayTestimonials: TestimonialItem[] = useMemo(() => {
    if (testimonialsList && testimonialsList.length > 0) {
      return testimonialsList.slice(0, 6).map((t: any, index: number) => {
        // Check if item matches one of the fallback items (e.g. by id or name) to preserve custom highlights
        const fallbackMatch = FALLBACK_TESTIMONIALS.find(
          (f) =>
            f.id === t.id ||
            f.name.toLowerCase() === (t.name || "").toLowerCase(),
        );

        if (fallbackMatch) {
          return {
            ...fallbackMatch,
            ...t,
            quotePrefix: fallbackMatch.quotePrefix,
            highlight: fallbackMatch.highlight,
            quoteSuffix: fallbackMatch.quoteSuffix,
            rotationClass:
              fallbackMatch.rotationClass ||
              ROTATION_CLASSES[index % ROTATION_CLASSES.length],
          };
        }

        return {
          id: t.id || `testi-${index}`,
          name: t.name || "Colleague",
          role: t.role || "Software Engineer",
          company: t.company,
          relation: t.relation,
          testimonial: t.testimonial || t.content || "",
          url: t.url,
          rotationClass: ROTATION_CLASSES[index % ROTATION_CLASSES.length],
        };
      });
    }
    return FALLBACK_TESTIMONIALS;
  }, [testimonialsList]);

  return (
    <section
      id="endorse"
      className="scroll-mt-16 lg:scroll-mt-24"
      aria-label="Peer endorsements and testimonials"
    >
      {/* Mobile section heading */}
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-canvas px-6 py-5 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-brand">
          Endorsements
        </h2>
      </div>

      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-brand">
            <MessageSquare size={18} className="animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand">
              Peer Endorsements
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
            What Colleagues & Partners Say
          </h2>
          <p className="text-xs text-secondary font-mono mt-0.5">
            ✦ Verifiable peer reviews from enterprise clients, backend engineers, and delivery leads.
          </p>
        </div>

        {/* Whiteboard Board Area */}
        <div className="relative rounded-2xl p-6 sm:p-8 bg-card border border-subtle shadow-sm overflow-hidden">
          {/* Subtle Grid Background Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-brand) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* 3-Column Pin Card Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {displayTestimonials.map((t) => (
              <motion.article
                key={t.id}
                className={cn(
                  "relative bg-canvas border border-subtle p-5 rounded-lg shadow-sm hover:border-subtle-hover transition-colors duration-150 flex flex-col justify-between group cursor-pointer",
                  t.rotationClass,
                )}
                whileHover={{ y: -3 }}
                onClick={() => {
                  if (setSelectedTestimonial) {
                    setSelectedTestimonial(t);
                  }
                }}
              >
                {/* Visual Pushpin / Paku Payung */}
                <div
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full bg-secondary border border-primary shadow-sm mx-auto -mt-2 mb-3"
                />

                {/* Quote Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="relative">
                    <Quote
                      size={18}
                      className="text-brand/30 absolute -top-1 -left-1 pointer-events-none"
                    />
                    <p className="text-xs sm:text-[13px] text-secondary leading-relaxed font-sans pt-3 line-clamp-6">
                      {renderHighlightedText(t)}
                    </p>
                  </div>

                  {/* Author Meta Footer */}
                  <div className="mt-6 pt-4 border-t border-subtle/60 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      {t.url ? (
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm font-display font-bold text-primary tracking-wide hover:text-brand inline-flex items-center gap-1 transition-colors"
                        >
                          {t.name}
                          <ExternalLink size={12} className="opacity-70" />
                        </a>
                      ) : (
                        <h3 className="text-sm font-display font-bold text-primary tracking-wide">
                          {t.name}
                        </h3>
                      )}
                    </div>
                    <p className="text-xs text-brand font-medium">
                      {t.role}
                    </p>
                    <span className="text-[10px] font-mono text-muted">
                      {t.relation || t.company}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
