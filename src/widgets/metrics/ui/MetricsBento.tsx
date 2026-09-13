import React from 'react';
import { DollarSign, Zap, ShieldCheck, RefreshCw } from 'lucide-react';

interface MetricItem {
  value: string;
  label: string;
  description: string;
  subtext: string;
  icon: React.ReactNode;
}

const OPERATIONAL_METRICS: MetricItem[] = [
  {
    value: '$18K / yr',
    label: 'Infrastructure Cost Saved',
    description: 'Cloud resource right-sizing & query indexing optimization at Telkomsel.',
    subtext: 'Documented Annual Impact',
    icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
  },
  {
    value: 'Sub-Second',
    label: 'Data Synchronization Latency',
    description: 'Event-driven cross-service sync between SAP & HRIS via Azure Service Bus.',
    subtext: 'Enterprise B2B SaaS (SERA - Astra)',
    icon: <Zap className="w-4 h-4 text-cyan-400" />,
  },
  {
    value: 'Zero-Downtime',
    label: 'Fault-Tolerant AI Pipelines',
    description: 'Multi-provider fallback (Gemini ➔ Groq ➔ Claude) & decoupled BullMQ worker.',
    subtext: 'AuraFlow AI Architecture',
    icon: <RefreshCw className="w-4 h-4 text-indigo-400" />,
  },
  {
    value: 'OJK & BI',
    label: 'Regulated Compliance Standard',
    description: 'ACID transaction isolation, double-entry ledger balances, and audit trails.',
    subtext: 'Financial Compliance Engineering',
    icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
  },
];

export const MetricsBento: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
            System Impact
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            Operational &amp; Production Metrics
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-500 hidden sm:inline-block">
          ● Verified Production Metrics
        </span>
      </div>

      {/* Bento Grid 4 Kolom/Kartu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPERATIONAL_METRICS.map((metric, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-zinc-400">{metric.subtext}</span>
                <div className="p-1.5 rounded-md bg-zinc-800/80 border border-zinc-700/40">
                  {metric.icon}
                </div>
              </div>

              <div className="text-2xl font-bold font-mono text-white mt-3 tracking-tight">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-zinc-200 mt-0.5">
                {metric.label}
              </div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {metric.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsBento;
