"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Cpu,
  Server,
  BrainCircuit,
  Database,
  Cloud,
  BriefcaseBusiness,
} from "lucide-react";
import { AnimatedDivider } from "@/shared/ui/AnimatedDivider";
import { useTheme } from "@/shared/ui/ThemeProvider";
import { cn } from "@/shared/lib/utils";

interface ProficiencySectionProps {
  renderIcon?: (
    iconName: string,
    isSavings: boolean,
    customSize?: number,
  ) => React.ReactNode;
  isDark?: boolean;
}

interface SkillItem {
  name: string;
  status: "PROD" | "R&D";
}

interface Pillar {
  id: string;
  pillarNumber: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  skills: SkillItem[];
}

const ARCHITECTURE_PILLARS: Pillar[] = [
  {
    id: "core-backend",
    pillarNumber: "01",
    title: "Core Backend & Distributed Systems",
    description:
      "High-concurrency services, event-driven orchestration, idempotency, and IPC.",
    icon: Server,
    skills: [
      { name: "Go (Golang)", status: "PROD" },
      { name: "Node.js / TypeScript (NestJS, Fastify, Express)", status: "PROD" },
      { name: "Azure Service Bus", status: "PROD" },
      { name: "Kafka", status: "PROD" },
      { name: "Redis (BullMQ & Pub/Sub)", status: "PROD" },
      { name: "gRPC / REST", status: "PROD" },
    ],
  },
  {
    id: "applied-ai",
    pillarNumber: "02",
    title: "Applied AI & Agentic Workflows",
    description:
      "Production LLM pipelines, multi-provider failover routers, deterministic schema guards.",
    icon: BrainCircuit,
    skills: [
      { name: "LangGraph (Multi-Agent & HITL)", status: "PROD" },
      { name: "Multi-Provider LLM Routers", status: "PROD" },
      { name: "Fastify SSE Direct Streaming", status: "PROD" },
      { name: "Pydantic / Schema Guardrails", status: "PROD" },
      { name: "Local LLM Inference (vLLM / Ollama)", status: "R&D" },
    ],
  },
  {
    id: "data-architecture",
    pillarNumber: "03",
    title: "Data Architecture & Storage",
    description:
      "Relational modeling, distributed caching, ACID ledger transactions.",
    icon: Database,
    skills: [
      { name: "PostgreSQL (Indexing & Partitioning)", status: "PROD" },
      { name: "Prisma", status: "PROD" },
      { name: "TypeORM", status: "PROD" },
      { name: "Redis (Distributed Lock & Cache)", status: "PROD" },
      { name: "pgvector", status: "R&D" },
      { name: "Double-Entry Ledger", status: "PROD" },
    ],
  },
  {
    id: "cloud-infra",
    pillarNumber: "04",
    title: "Cloud, Infrastructure & API Contracts",
    description:
      "Containerization, edge resilience, CI/CD pipelines, and contract security.",
    icon: Cloud,
    skills: [
      { name: "Docker", status: "PROD" },
      { name: "Azure Cloud Services", status: "PROD" },
      { name: "OpsCtrl", status: "PROD" },
      { name: "Cloudflare Tunnel & Edge Routing", status: "PROD" },
      { name: "Linux / VPS Systemd", status: "PROD" },
      { name: "Scalar & OpenAPI Docs", status: "PROD" },
    ],
  },
];

export default function ProficiencySection({
  renderIcon,
  isDark: propIsDark,
}: Readonly<ProficiencySectionProps>) {
  const { isDark: contextIsDark } = useTheme();
  const isDark = propIsDark !== undefined ? propIsDark : contextIsDark;

  return (
    <>
      <section id="proficiency" className="scroll-mt-20">
        <motion.div
          className="max-w-7xl mx-auto mb-20"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-neu-accent mb-1">
                <Cpu size={18} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                  Engineering Capability Matrix
                </span>
              </div>
              <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
                Production Systems Architecture
              </h2>
              <p className="text-xs text-neu-text-muted font-mono mt-1">
                ✦ 4-Pillar foundation engineered for high concurrency, deterministic failover, and verified telemetry.
              </p>
            </div>

            {/* Status Legend Pill */}
            <div className="flex items-center gap-4 text-[11px] font-mono select-none self-start md:self-auto py-1.5 px-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-neu-text font-semibold">PROD</span>
                <span className="text-neu-text-muted/60 text-[10px]">In Production</span>
              </span>
              <span className="text-zinc-400 dark:text-zinc-600">|</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="text-neu-text font-semibold">R&D</span>
                <span className="text-neu-text-muted/60 text-[10px]">Active R&D</span>
              </span>
            </div>
          </div>

          {/* 4 Pillars Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARCHITECTURE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.id}
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm hover:border-neu-accent/40 transition-all duration-300 flex flex-col justify-between gap-6 shadow-sm"
                >
                  <div className="space-y-4">
                    {/* Pillar Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-neu-accent group-hover:scale-105 transition-transform">
                          <Icon size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-neu-accent tracking-widest uppercase block">
                            Pillar {pillar.pillarNumber}
                          </span>
                          <h3 className="text-base font-display font-bold text-neu-text group-hover:text-neu-accent transition-colors">
                            {pillar.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Pillar Description */}
                    <p className="text-xs text-neu-text-muted font-normal leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Skill Chips */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      {pillar.skills.map((skill) => {
                        const isProd = skill.status === "PROD";
                        return (
                          <div
                            key={skill.name}
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-200",
                              "bg-black/20 dark:bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700",
                            )}
                          >
                            <span className="text-neu-text font-medium">
                              {skill.name}
                            </span>
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border",
                                isProd
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30",
                              )}
                            >
                              {skill.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </motion.div>

        {/* Animated divider with a section-specific icon and quote tooltip */}
        <AnimatedDivider
          icon={BriefcaseBusiness}
          quote="Every system I've built carries the weight of the
                problems it was meant to solve."
        />
      </section>
    </>
  );
}

