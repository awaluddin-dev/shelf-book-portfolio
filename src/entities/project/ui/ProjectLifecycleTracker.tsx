import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";
import {
  Code2,
  Compass,
  Layers,
  Activity,
  Milestone,
  ExternalLink,
} from "lucide-react";
import EmptyState from "@/shared/ui/EmptyState";

export default function ProjectLifecycleTracker({
  projectId,
  spineColor: _spineColor,
}: {
  projectId: string;
  spineColor: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [phases, setPhases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lifecycle")
      .then((res) => res.json())
      .then((data) => {
        const arr = data.data || data;
        const projectPhases = (Array.isArray(arr) ? arr : [])
          .filter((p) => p.projectId === projectId)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setPhases(projectPhases);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  const getPhaseMeta = (stage: string, _index: number) => {
    const s = stage?.toLowerCase() || "";
    if (s.includes("plan")) {
      return {
        icon: <Compass size={16} className="text-purple-500" />,
        borderColor: "group-hover:border-purple-500",
        glowColor: "rgba(168,85,247,0.15)",
        colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      };
    }
    if (s.includes("arch") || s.includes("design")) {
      return {
        icon: <Layers size={16} className="text-blue-500" />,
        borderColor: "group-hover:border-blue-500",
        glowColor: "rgba(59,130,246,0.15)",
        colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      };
    }
    if (s.includes("exec") || s.includes("code")) {
      return {
        icon: <Code2 size={16} className="text-emerald-500" />,
        borderColor: "group-hover:border-emerald-500",
        glowColor: "rgba(16,185,129,0.15)",
        colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      };
    }
    return {
      icon: <Activity size={16} className="text-rose-500" />,
      borderColor: "group-hover:border-rose-500",
      glowColor: "rgba(244,63,94,0.15)",
      colorClass: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    };
  };

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-neu-text-muted animate-pulse">
        Loading Lifecycle...
      </div>
    );
  }

  if (phases.length === 0) {
    return (
      <EmptyState message="No lifecycle phases defined for this project" />
    );
  }

  return (
    <div className="mb-10 p-6 md:p-8 rounded-3xl glass-card-inset border border-gray-300/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider flex items-center gap-2">
            <Milestone size={14} /> Project Lifecycle
          </h4>
          <p className="text-xs font-mono text-neu-text-muted mt-1">
            Tracking execution from concept to deployment.
          </p>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative z-10 pl-4 md:pl-8 border-l border-white/5 space-y-8">
        {phases.map((phase, i) => {
          const meta = getPhaseMeta(phase.stage, i);
          const isHovered = hoveredIndex === i;

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group cursor-pointer"
            >
              {/* Timeline Dot with Glow */}
              <div
                className={cn(
                  "absolute -left-[30px] md:-left-[46px] top-1 w-6 h-6 rounded-full glass-card-inset flex items-center justify-center border transition-all duration-300",
                  meta.borderColor,
                )}
                style={{
                  boxShadow: isHovered ? `0 0 15px ${meta.glowColor}` : "none",
                  borderColor: isHovered ? undefined : "rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full transition-transform duration-300",
                    isHovered ? "scale-150" : "scale-100",
                  )}
                  style={{
                    backgroundColor: isHovered
                      ? meta.glowColor.replace("0.15", "1")
                      : "rgba(255,255,255,0.2)",
                  }}
                />
              </div>

              {/* Phase Card */}
              <div className="flex flex-col md:flex-row gap-4 md:items-start group-hover:translate-x-2 transition-transform duration-300">
                {/* Stage Badge & Date */}
                <div className="flex-shrink-0 w-40 pt-1">
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider mb-2 border",
                      meta.colorClass,
                    )}
                  >
                    {meta.icon}
                    {phase.stage}
                  </div>
                  <div className="text-xs font-mono text-neu-text-muted font-medium">
                    {phase.date}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h5
                    className={cn(
                      "text-base font-bold font-display mb-2 transition-colors",
                      isHovered ? "text-neu-text" : "text-neu-text-muted",
                    )}
                  >
                    {phase.title}
                  </h5>
                  <p className="text-sm font-light leading-relaxed text-neu-text-muted/80">
                    {phase.description}
                  </p>

                  {phase.evidentUrl && (
                    <a
                      href={phase.evidentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-500 hover:text-blue-600 mt-3 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={12} /> View Evidence
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
