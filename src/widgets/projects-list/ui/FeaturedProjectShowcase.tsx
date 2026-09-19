"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Globe,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Workflow,
  Terminal,
} from "lucide-react";
import { SiGithub } from "@/shared/ui/icons/BrandIcons";
import ProjectArchitectureDiagram from "@/entities/project/ui/ProjectArchitectureDiagram";

interface FeaturedProjectShowcaseProps {
  project: any;
  setSelectedProject: (p: any) => void;
}

export function FeaturedProjectShowcase({
  project,
  setSelectedProject,
}: Readonly<FeaturedProjectShowcaseProps>) {
  const [isArchOpen, setIsArchOpen] = useState(false);

  const highlights = useMemo(() => {
    if (Array.isArray(project.keyHighlights) && project.keyHighlights.length > 0) {
      return project.keyHighlights;
    }
    if (typeof project.keyHighlights === "string" && project.keyHighlights.trim()) {
      return project.keyHighlights.split("\n").map((s: string) => s.trim()).filter(Boolean);
    }
    return [
      "Engineered resilient asynchronous task queue with automated failure recovery",
      "Sub-50ms p99 latency target across edge regions with stateful checkpoints",
      "Strict zero-leakage security boundaries with automated audit logging",
    ];
  }, [project.keyHighlights]);

  const pipelineFlow = useMemo(() => {
    if (project.pipelineFlow && project.pipelineFlow.length > 0) {
      return project.pipelineFlow;
    }
    return ["Client API", "Gateway / BullMQ", "Execution Worker", "Cache Tier", "PostgreSQL"];
  }, [project.pipelineFlow]);

  const archDiagramUrl = project.architectureDiagram || project.systemArchitectures?.[0]?.imageUrl;

  return (
    <article className="rounded-2xl border border-subtle bg-card shadow-sm hover:border-subtle-hover transition-all duration-200 overflow-hidden flex flex-col">
      {/* Top Banner: Category & Featured Status */}
      <div className="px-5 py-3.5 sm:px-6 bg-canvas/60 border-b border-subtle flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-400" /> Flagship Production System
          </span>
          {project.domainBadge && (
            <span className="px-2.5 py-1 rounded-md bg-subtle text-primary text-[10px] font-mono font-medium uppercase tracking-wider">
              {project.domainBadge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-secondary">
          <span>{project.category || "AI Systems"}</span>
          <span className="text-subtle">•</span>
          <span>{project.date || "2024"}</span>
        </div>
      </div>

      <div className="p-5 sm:p-7 flex flex-col gap-6">
        {/* Header: Title, Subtitle, and Primary Actions */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h3
              onClick={() => setSelectedProject(project)}
              className="text-xl sm:text-2xl font-display font-bold text-primary hover:text-brand transition-colors cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>{project.title}</span>
              <ExternalLink
                size={18}
                className="text-secondary group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
              />
            </h3>
            {project.subtitle && (
              <p className="text-sm font-mono text-secondary mt-1 max-w-2xl">
                {project.subtitle}
              </p>
            )}
          </div>

          {/* Quick Action Buttons for Recruiters / Reviewers */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-canvas hover:text-primary text-secondary border border-subtle hover:border-subtle-hover transition-colors text-xs font-mono active:scale-95"
                title="View Source Code on GitHub"
              >
                <SiGithub size={14} />
                <span className="font-semibold">Repository</span>
              </a>
            )}

            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all active:scale-95 shadow-sm"
              >
                <Globe size={13} />
                <span>Live System</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-primary bg-canvas border border-subtle hover:border-subtle-hover transition-all active:scale-95"
              >
                <BookOpen size={13} />
                <span>Dev Log</span>
              </button>
            )}
          </div>
        </div>

        {/* Media Preview (Screenshot / GIF) if provided */}
        {project.mediaUrl && (
          <div className="relative rounded-xl overflow-hidden border border-subtle bg-black/40 group max-h-[360px] flex items-center justify-center">
            {project.mediaType === "video" ? (
              <video
                src={project.mediaUrl}
                controls
                className="w-full max-h-[360px] object-cover rounded-xl"
              />
            ) : (
              <div className="relative w-full h-64 sm:h-80">
                <Image
                  src={project.mediaUrl}
                  alt={project.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  unoptimized={project.mediaUrl.startsWith("/") || project.mediaUrl.endsWith(".gif")}
                />
              </div>
            )}
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-white flex items-center gap-1.5">
              <Terminal size={11} className="text-brand" />
              <span>{project.mediaType === "gif" ? "Live Demo GIF" : "Production Capture"}</span>
            </div>
          </div>
        )}

        {/* Dual Perspective: Recruiter Highlights vs Senior Engineer Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Recruiter / Impact Summary Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 p-4 sm:p-5 rounded-xl bg-canvas border border-subtle">
            <div className="flex items-center justify-between border-b border-subtle pb-2.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-status" /> Recruiter Summary & Impact
              </span>
            </div>

            {/* Impact Metric Stats */}
            {project.stats && project.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {project.stats.slice(0, 4).map((stat: any, sIdx: number) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-lg bg-card border border-subtle flex flex-col justify-between"
                  >
                    <span className="text-base sm:text-lg font-mono font-bold text-status">
                      {stat.value}
                    </span>
                    <span className="text-[11px] font-mono text-secondary mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Key Engineering Highlights Bullet points */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold">
                Key Technical Achievements:
              </span>
              <ul className="space-y-2 text-xs text-secondary leading-relaxed">
                {highlights.map((item: string, hIdx: number) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <span className="text-brand font-bold shrink-0 mt-0.5">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="pt-2 border-t border-subtle">
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold block mb-2">
                  Stack Verified:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-card text-primary text-[10px] font-mono border border-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Senior Engineer / System Breakdown Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 p-4 sm:p-5 rounded-xl bg-canvas border border-subtle">
            <div className="flex items-center justify-between border-b border-subtle pb-2.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Cpu size={14} className="text-brand" /> Senior Engineer Breakdown
              </span>
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="text-[11px] font-mono text-brand hover:underline font-bold"
              >
                Read Technical Spec →
              </button>
            </div>

            {/* Problem & Architectural Solution */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-lg bg-card border border-subtle">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  • The Bottleneck / Problem
                </span>
                <p className="text-secondary font-normal">
                  {project.problem ||
                    "Traditional synchronous architectures suffer catastrophic cascading timeouts, memory unbounded drift, and unobserved edge failure states under distributed loads."}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-card border border-subtle">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-status block mb-1">
                  • System Solution & Architectural Decisions
                </span>
                <p className="text-secondary font-normal">
                  {project.solution ||
                    "Decoupled stateful workloads into an event-driven worker hierarchy. Introduced checkpointed LangGraph workflows, deterministic idempotency filters, and distributed Redis BullMQ message brokers."}
                </p>
              </div>
            </div>

            {/* Data Pipeline & Topology */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold flex items-center gap-1">
                <Workflow size={11} className="text-brand" /> End-to-End Pipeline Topology
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                {pipelineFlow.map((step: string, idx: number) => (
                  <React.Fragment key={idx}>
                    <span className="px-2.5 py-1 rounded-md bg-card text-primary border border-subtle font-medium">
                      {step}
                    </span>
                    {idx < pipelineFlow.length - 1 && (
                      <span className="text-brand font-bold">➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* In-Place Architecture Blueprint Toggle */}
            <div className="pt-2 border-t border-subtle flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsArchOpen(!isArchOpen)}
                className="inline-flex items-center justify-between text-xs font-mono font-bold text-brand hover:text-primary transition-colors py-1 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Layers size={13} />
                  {isArchOpen ? "[ Hide Architecture Blueprint ]" : "[ Inspect Architecture Blueprint ]"}
                </span>
                {isArchOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <AnimatePresence>
                {isArchOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 rounded-xl border border-subtle bg-card flex flex-col gap-2">
                      {archDiagramUrl ? (
                        <div className="min-h-[220px] w-full rounded-lg overflow-hidden border border-subtle bg-black/20">
                          <ProjectArchitectureDiagram imageUrl={archDiagramUrl} />
                        </div>
                      ) : (
                        <div className="p-6 text-center text-xs font-mono text-secondary italic flex flex-col items-center gap-2">
                          <Layers size={22} className="text-secondary/40" />
                          <span>Detailed interactive topology map is documented in the full technical dev log.</span>
                          <button
                            type="button"
                            onClick={() => setSelectedProject(project)}
                            className="mt-1 text-brand hover:underline text-xs font-bold"
                          >
                            Open Full Dev Log →
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default FeaturedProjectShowcase;
