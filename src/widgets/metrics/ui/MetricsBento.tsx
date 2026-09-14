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
          <span className="text-[11px] font-mono text-brand uppercase tracking-widest">
            System Impact
          </span>
          <h3 className="text-xl font-bold text-primary mt-0.5">
            Operational &amp; Production Metrics
          </h3>
        </div>
        <span className="text-xs font-mono text-muted hidden sm:inline-block">
          ● Verified Production Metrics
        </span>
      </div>

      {/* Bento Grid 4 Kolom/Kartu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPERATIONAL_METRICS.map((metric, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-subtle bg-card hover:border-subtle-hover transition-colors duration-150 flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-secondary">{metric.subtext}</span>
                <div className="p-1.5 rounded-md bg-canvas border border-subtle">
                  {metric.icon}
                </div>
              </div>

              <div className="text-2xl font-bold font-mono text-primary mt-3 tracking-tight">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-primary mt-0.5">
                {metric.label}
              </div>
              <p className="text-xs text-secondary mt-2 leading-relaxed">
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
