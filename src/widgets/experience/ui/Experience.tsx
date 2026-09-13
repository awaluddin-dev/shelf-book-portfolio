/* eslint-disable sonarjs/cognitive-complexity, sonarjs/no-nested-functions */
import React from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  MessageCircle,
} from "lucide-react";
import { AnimatedDivider } from "@/shared/ui/AnimatedDivider";
import { cn } from "@/shared/lib/utils";

interface ExperienceSectionProps {
  isDark: boolean;
}

export interface CareerExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  isActive?: boolean;
  bullets: Array<{
    situation: string;
    action: string;
    metricPrefix?: string;
    metric: string;
    metricSuffix?: string;
  }>;
  techTags: string[];
}

export const CAREER_EXPERIENCES: CareerExperience[] = [
  {
    id: "sera",
    company: "PT Serasi Autoraya (SERA) — Astra Group",
    role: "Backend Engineer (Consultant via PT Insure Media Solusi)",
    period: "2024 – Present",
    isActive: true,
    bullets: [
      {
        situation: "Managing core enterprise fleet telemetry and transaction services under high vehicle concurrency,",
        action: "engineered event-driven microservices and message pipelines with idempotency locks, achieving",
        metric: "99.9% uptime",
        metricSuffix: " across distributed operations.",
      },
      {
        situation: "Facing bottlenecks in cross-system contract sync and asynchronous queue processing,",
        action: "orchestrated Azure Service Bus pub/sub topics and optimized query layers to reduce broker latency by",
        metric: "35%",
        metricSuffix: " under peak load.",
      },
      {
        situation: "To prevent transaction replay vulnerabilities in distributed scheduling workflows,",
        action: "designed distributed locking and deduplication mechanisms handling",
        metric: "100K+ daily state transitions",
        metricSuffix: " with zero recorded duplicate entries.",
      },
    ],
    techTags: [
      "Go (Golang)",
      "Node.js",
      "TypeScript",
      "Azure Service Bus",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
  },
  {
    id: "telkomsel",
    company: "Telkomsel",
    role: "Software Engineer (PKWT via PT Deta Sukses Makmur)",
    period: "2023 – 2024",
    isActive: false,
    bullets: [
      {
        situation: "High monthly cloud infrastructure costs across digital enterprise operational pipelines,",
        action: "refactored backend microservice resource allocation, query caching, and batch execution pipelines, directly saving",
        metric: "$18K/year",
        metricSuffix: " in server expenditure.",
      },
      {
        situation: "Critical enterprise integrations faced API latency spikes during high-concurrency peak windows,",
        action: "re-architected internal data retrieval pipelines and Redis multi-tier caching, slicing p95 latency by",
        metric: "45%",
        metricSuffix: " across high-traffic endpoints.",
      },
      {
        situation: "Manual validation bottlenecks delayed service deployment verification across staging environments,",
        action: "implemented automated test suites and contract validation pipelines, expanding test coverage to",
        metric: "88%",
        metricSuffix: " and preventing regression leaks.",
      },
    ],
    techTags: [
      "Node.js",
      "Express",
      "Redis",
      "PostgreSQL",
      "Microservices",
      "Jest",
      "CI/CD",
    ],
  },
  {
    id: "fintech",
    company: "Regulated Fintech Company (OJK & BI Regulated)",
    role: "Backend Engineer",
    period: "2022 – 2023",
    isActive: false,
    bullets: [
      {
        situation: "Strict regulatory audit mandates required provable transaction reconciliation across disparate banking rails,",
        action: "architected compliance engineering systems and digital wallet ledger pipelines reconciling",
        metric: "$2.5M+ daily transaction volume",
        metricSuffix: " with double-entry cryptographic verification.",
      },
      {
        situation: "High failure rates and inconsistent timeouts during payment gateway gateway integrations,",
        action: "developed resilient payment integration routers with circuit breakers and webhook failover handlers, maintaining",
        metric: "99.98% successful settlement",
        metricSuffix: " across all partner channels.",
      },
      {
        situation: "Demands from OJK & BI regulators for deterministic audit logs and data integrity validation,",
        action: "implemented immutable audit log schemas with PostgreSQL transaction isolation levels, guaranteeing",
        metric: "100% audit trail compliance",
        metricSuffix: " during statutory financial inspections.",
      },
    ],
    techTags: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Digital Wallet Ledger",
      "Payment Gateways",
      "Compliance Engineering",
      "BullMQ",
    ],
  },
  {
    id: "maccon",
    company: "PT Maccon Generasi Mandiri",
    role: "Software Developer",
    period: "2022 – 2022",
    isActive: false,
    bullets: [
      {
        situation: "Legacy cloud compute models created unsustainable hosting overhead for a newly launched counseling SaaS platform,",
        action: "refactored backend server architecture to optimized container instances with auto-scaling rules, yielding",
        metric: "80% server cost reduction",
        metricSuffix: " while sustaining identical traffic levels.",
      },
      {
        situation: "Automating user session booking, international billing, and confidential video consultations,",
        action: "integrated Stripe payment webhooks with Zoom API session orchestration, achieving",
        metric: "zero-drop automated session provisioning",
        metricSuffix: " for thousands of active clients.",
      },
      {
        situation: "Counselors required instant notifications for urgent client appointments and rescheduling,",
        action: "deployed asynchronous event workers and webhook queues that processed booking notifications in under",
        metric: "1.2 seconds",
        metricSuffix: " from payment confirmation.",
      },
    ],
    techTags: [
      "Node.js",
      "TypeScript",
      "SaaS Architecture",
      "Stripe API",
      "Zoom API",
      "PostgreSQL",
      "Docker",
    ],
  },
  {
    id: "daikin",
    company: "PT Daikin Industries Indonesia",
    role: "HVAC Engineer",
    period: "2019 – 2022",
    isActive: false,
    bullets: [
      {
        situation: "Demanding industrial and commercial facilities required rigorous thermodynamic and airflow control,",
        action: "led engineering execution and sensor telemetry commissioning for",
        metric: "152+ industrial projects",
        metricSuffix: " across manufacturing plants and high-rise developments.",
      },
      {
        situation: "Critical refrigeration loops suffered from thermal efficiency drops during peak ambient load cycles,",
        action: "calibrated PID feedback loops, sensor transmitter arrays, and electronic expansion valves, elevating system COP by",
        metric: "14%",
        metricSuffix: " in heavy-duty environments.",
      },
      {
        situation: "Unscheduled equipment downtime risked extensive production losses in mission-critical manufacturing facilities,",
        action: "established predictive maintenance inspection protocols and telemetry diagnosis, decreasing unexpected downtime by",
        metric: "28%",
        metricSuffix: " across managed industrial sites.",
      },
    ],
    techTags: [
      "Thermodynamic Systems",
      "PID Controller Telemetry",
      "Industrial Automation",
      "152+ Projects",
      "Feedback Control Loops",
    ],
  },
];

export default function ExperienceSection({
  isDark,
}: Readonly<ExperienceSectionProps>) {
  return (
    <>
      {/* Experience Section */}
      <section id="experience" className="scroll-mt-20">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-full space-y-8">
            <div className="mb-10">
              <div className="flex items-center gap-2 text-neu-accent mb-1">
                <Briefcase size={18} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                  Journey & Chronology
                </span>
              </div>
              <h2 className="text-3xl font-display font-bold text-neu-text tracking-tight">
                Experience
              </h2>
              <p className="text-xs text-neu-text-muted font-mono mt-1">
                ✦ Chronological timeline of professional roles, core
                contributions, and enterprise projects.
              </p>
            </div>

            {/* Vertical Career Timeline */}
            <motion.div
              className="mt-10 p-5 sm:p-8 rounded-3xl glass-card-inset space-y-8 max-w-full relative"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-300/30 dark:border-zinc-800/30 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-neu-accent mb-1">
                    <Briefcase size={18} />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-neu-accent">
                      Career Timeline
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-neu-text tracking-tight">
                    Professional Experience
                  </h2>
                </div>
              </div>

              {/* Vertical Timeline Tree */}
              <div className="relative pl-6 sm:pl-8 border-l border-zinc-800 space-y-12">
                {CAREER_EXPERIENCES.map((exp) => {
                  return (
                    <article
                      key={exp.id}
                      className="relative group transition-all duration-300"
                    >
                      {/* Pointer Dot */}
                      <div
                        className={cn(
                          "absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300",
                          exp.isActive
                            ? "bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            : "bg-zinc-800 border-zinc-700 group-hover:border-zinc-500",
                        )}
                      >
                        {exp.isActive && (
                          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                        )}
                      </div>

                      {/* Header Info */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                        <div>
                          <h3 className="text-base sm:text-lg font-display font-bold text-neu-text group-hover:text-neu-accent transition-colors">
                            {exp.company}
                          </h3>
                          <p className="text-xs sm:text-sm font-medium text-neu-accent">
                            {exp.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-neu-text-muted shrink-0">
                            {exp.period}
                          </span>
                          {exp.isActive && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      {/* STAR Format Bullets */}
                      <ul className="mt-3 space-y-2.5 text-xs sm:text-sm text-neu-text-muted leading-relaxed">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <span className="text-neu-accent mt-1 shrink-0">✦</span>
                            <span>
                              <span>{bullet.situation} </span>
                              <span>{bullet.action} </span>
                              {bullet.metricPrefix && <span>{bullet.metricPrefix} </span>}
                              <strong className="text-white font-medium">
                                {bullet.metric}
                              </strong>
                              {bullet.metricSuffix && <span>{bullet.metricSuffix}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {exp.techTags.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800/80 font-mono text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
        {/* Animated divider with a section-specific icon and quote tooltip */}
        <AnimatedDivider
          icon={MessageCircle}
          quote="The words of those I've crossed paths with often become the fuel that drives me to keep creating."
        />
      </section>
    </>
  );
}

