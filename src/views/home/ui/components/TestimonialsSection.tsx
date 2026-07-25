
import React from 'react';

import { cn } from "@/shared/lib/utils";
import { MessageSquare, Quote } from "lucide-react";

export function TestimonialsSection({ testimonialsList, _isLoading, setSelectedTestimonial }: any) {
    return (
      <section
        id="endorse"
        className="max-w-7xl mx-auto mt-24 mb-24 overflow-visible scroll-mt-20"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-neu-accent mb-2">
              <MessageSquare size={18} className="animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Endorsements
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
              What Colleagues & Clients Say
            </h2>
          </div>
        </div>
        <div className="relative w-full overflow-hidden py-24 -my-12 px-6">
          <div className="animate-marquee flex gap-10 select-none">
            {[
              ...testimonialsList,
              ...testimonialsList,
              ...testimonialsList,
            ].map((t: any, index: number) => (
              <div
                key={`${t.id}-dup-${index}`}
                className={cn(
                  "flex-shrink-0 w-[85vw] sm:w-[440px] max-w-96 sm:max-w-none p-5 sm:p-8 rounded-3xl glass-card relative flex flex-col justify-between group transition-all duration-500 ease-out border border-white/5",
                  "transform-gpu perspective-1000",
                  index % 2 === 0
                    ? "rotate-y-4 -rotate-1"
                    : "-rotate-y-4 rotate-1",
                  "hover:rotate-y-0 hover:rotate-x-0 hover:scale-[1.05] hover:-translate-y-3 hover:z-30",
                  "hover:border-blue-500 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.3)] dark:hover:border-emerald-400 dark:hover:shadow-[0_25px_50px_-12px_rgba(74,222,128,0.3)]",
                )}
              >
                {t.url && (
                  <div className="mb-6 inline-flex px-3 py-1 rounded-full glass-card-inset text-xs font-mono text-neu-accent font-semibold tracking-wide">
                    ✦ Verifiable URL Profile
                  </div>
                )}
                <div className="mb-6 relative z-10 flex-1 flex flex-col">
                  <div className="absolute -top-3 -left-2 text-neu-accent/30 group-hover:text-neu-accent/60 transition-colors z-10 pointer-events-none">
                    <Quote size={32} />
                  </div>
                  <div className="p-5 pt-8 rounded-2xl glass-card-inset text-sm text-neu-text-muted leading-relaxed font-sans italic relative bg-neu-bg/40 flex-1 flex flex-col justify-between">
                    <div
                      className={
                        t.testimonial?.length > 150 ? "line-clamp-4" : ""
                      }
                    >
                      &ldquo;{t.testimonial}&rdquo;
                    </div>
                    {t.testimonial?.length > 150 && (
                      <button
                        onClick={() => setSelectedTestimonial(t)}
                        className="mt-3 text-xs font-bold text-neu-accent hover:underline relative z-20 flex items-center gap-1 self-start"
                      >
                        See more...
                      </button>
                    )}
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="pt-4 border-t border-gray-300/30 dark:border-gray-700/30 flex flex-col gap-1">
                    {t.url ? (
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-neu-text hover:text-neu-accent hover:underline transition-colors relative z-20"
                      >
                        {t.name}
                      </a>
                    ) : (
                      <span className="text-base font-bold text-neu-text">
                        {t.name}
                      </span>
                    )}
                    <div className="text-xs text-neu-text-muted">
                      <span className="italic">{t.role}</span> at{" "}
                      <span className="font-bold">{t.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {(t.tags || []).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 glass-card-inset text-xs font-mono font-medium rounded-lg text-neu-text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}
