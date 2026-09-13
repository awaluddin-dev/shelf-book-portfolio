"use client";

import React from "react";
import { TrendingDown, Zap, ShieldCheck, FileCheck2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface MetricCardItem {
  id: string;
  value: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  valueColor?: string;
}

export const METRIC_CARDS: MetricCardItem[] = [
  {
    id: "cost-optimization",
    value: "$18K/yr",
    label: "Infra Cost Optimization",
    sub: "Query refactoring & resource right-sizing",
    icon: TrendingDown,
    accentColor: "text-emerald-400",
    valueColor: "text-emerald-400",
  },
  {
    id: "sync-latency",
    value: "Sub-Second",
    label: "Data Sync Latency",
    sub: "Azure Service Bus & Redis pub/sub",
    icon: Zap,
    accentColor: "text-cyan-400",
  },
  {
    id: "production-delivery",
    value: "Zero Downtime",
    label: "Production Delivery",
    sub: "Decoupled workers & BullMQ retry queue",
    icon: ShieldCheck,
    accentColor: "text-indigo-400",
  },
  {
    id: "compliance-engineering",
    value: "OJK & BI",
    label: "Compliance Engineering",
    sub: "ACID transactions & ledger audit trails",
    icon: FileCheck2,
    accentColor: "text-amber-400",
  },
];

interface MetricsBentoProps {
  className?: string;
}

export default function MetricsBento({ className }: Readonly<MetricsBentoProps>) {
  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {METRIC_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="group relative rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50 flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-neu-text-muted font-medium">
                  {card.label}
                </span>
                <div className={cn("p-1.5 rounded-lg bg-zinc-800/60", card.accentColor)}>
                  <Icon size={16} />
                </div>
              </div>

              <div>
                <div
                  className={cn(
                    "font-mono text-2xl font-bold tracking-tight",
                    card.valueColor || "text-white",
                  )}
                >
                  {card.value}
                </div>
                <p className="mt-1 text-xs text-neu-text-muted leading-relaxed">
                  {card.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
