"use client";

import { useState, useEffect } from "react";
import { Loader } from "@/shared/ui/Loader";
import { AdminPageSkeleton } from "@/widgets/admin-page-skeleton/ui/AdminPageSkeleton";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  CheckCircle,
  AlertCircle,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { Testimonial } from "@/shared/types";

export default function AdminDashboard() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroConfig, setHeroConfig] = useState<any>({ name: "", role: "" });
  const [metrics, setMetrics] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("isAdmin");
      router.push("/admin/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        router.push("/admin/login");
        return;
      }
    } catch (e) {
      console.error(e);
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      router.push("/admin/login");
      return;
    }

    if (localStorage.getItem("isAdmin") !== "true") {
      router.push("/admin/login");
      return;
    }

    Promise.all([
      fetch("/api/status").then((res) => res.json()),
      fetch("/api/testimonials?all=true").then((res) => res.json()),
      fetch("/api/v2/hero").then((res) => res.json()),
    ]).then(([statusData, testData, heroData]) => {
      let testExtracted = [];
      if (testData.data?.testimonials) {
        testExtracted = testData.data.testimonials;
      } else if (testData.testimonials) {
        testExtracted = testData.testimonials;
      } else if (Array.isArray(testData.data)) {
        testExtracted = testData.data;
      } else if (Array.isArray(testData)) {
        testExtracted = testData;
      }
      setTestimonials(testExtracted);

      const actualHeroConfig = heroData.data?.heroConfig || heroData.heroConfig;
      setHeroConfig(actualHeroConfig || {});

      let metricsExtracted = [];
      if (heroData.data?.metrics) {
        metricsExtracted = heroData.data.metrics;
      } else if (heroData.metrics) {
        metricsExtracted = heroData.metrics;
      } else if (Array.isArray(heroData.data)) {
        metricsExtracted = heroData.data;
      } else if (Array.isArray(heroData)) {
        metricsExtracted = heroData;
      }
      setMetrics(metricsExtracted);

      setLoading(false);
    });
  }, [router]);

  const saveHeroConfig = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/v2/hero", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ heroConfig, metrics }),
      });
      if (!res.ok) throw new Error("Failed");
      setToastMessage({
        message: "Hero Section updated successfully (v2)",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setToastMessage({
        message: "Failed to update hero section",
        type: "error",
      });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMetricChange = (index: number, field: string, value: any) => {
    const newMetrics = [...metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setMetrics(newMetrics);
  };

  const addMetric = () => {
    setMetrics([
      ...metrics,
      {
        id: "m_" + Date.now(),
        value: "",
        label: "",
        description: "",
        subtext: "",
        icon: "DollarSign",
        order: metrics.length + 1,
      },
    ]);
  };

  const removeMetric = (index: number) => {
    const newMetrics = [...metrics];
    newMetrics.splice(index, 1);
    setMetrics(newMetrics);
  };

  return (
    <>
      {isProcessing && <Loader fullScreen text="Processing..." />}
      {loading ? (
        <AdminPageSkeleton />
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-display tracking-tight">
              Dashboard Overview
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Opportunities Card */}
            <div className="glass-card rounded-3xl p-8 border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full glass-card-inset flex items-center justify-center">
                  <Briefcase className="text-neu-accent" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Opportunities</h2>
                  <p className="text-xs text-neu-text-muted font-mono">
                    Manage availability status
                  </p>
                </div>
              </div>
              <div className="p-6 glass-card-inset rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div
                    className={cn(
                      "text-sm font-bold transition-colors duration-300",
                      heroConfig.status === "available"
                        ? "text-emerald-500"
                        : "text-amber-500",
                    )}
                  >
                    {heroConfig.status === "available"
                      ? "Available for Opportunities"
                      : "Currently Busy / Closed"}
                  </div>
                  <div className="text-xs text-neu-text-muted font-mono mt-0.5">
                    {heroConfig.statusText || (heroConfig.status === "available" ? "Available for Remote Roles (UTC+7)" : "Not Available")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextStatus = heroConfig.status === "available" ? "busy" : "available";
                    const nextStatusText = nextStatus === "available"
                      ? "Available for Remote Roles (UTC+7)"
                      : "Currently Busy / Not Available";
                    setHeroConfig({
                      ...heroConfig,
                      status: nextStatus,
                      statusText: heroConfig.statusText || nextStatusText,
                      openForWork: nextStatus === "available",
                    });
                  }}
                  className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200 dark:bg-zinc-850 shadow-inner transition-colors duration-200 focus:outline-none cursor-pointer"
                >
                  <span
                    className={cn(
                      "inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200",
                      heroConfig.status === "available"
                        ? "translate-x-9 bg-emerald-500"
                        : "translate-x-1 bg-zinc-400",
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Stat Card placeholder if needed */}
            <div className="glass-card rounded-3xl p-8 border border-white/5 flex flex-col justify-center">
              <div className="text-sm text-neu-text-muted font-mono mb-2">
                Total Testimonials
              </div>
              <div className="text-4xl font-display font-bold text-neu-text">
                {testimonials.length}
              </div>
              <div className="text-xs text-neu-accent mt-2">
                {testimonials.filter((t: any) => t.status === "pending").length}{" "}
                pending review
              </div>
            </div>
          </div>

          {/* Hero Configuration Section */}
          <div className="glass-card rounded-3xl p-8 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold font-display">
                  Hero & Intro Section
                </h2>
                <p className="text-xs font-mono text-neu-text-muted">
                  Manage your display name, role, and metric strip.
                </p>
              </div>
              <button
                type="button"
                onClick={saveHeroConfig}
                className="flex items-center gap-2 px-4 py-2 bg-neu-accent text-white rounded-xl hover:bg-neu-accent/90 transition-colors font-bold text-sm shadow-neu-sm"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>

            <div className="space-y-6">
              {/* Name & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-neu-text-muted">
                    Display Name
                  </span>
                  <input
                    value={heroConfig.name || ""}
                    onChange={(e) =>
                      setHeroConfig({ ...heroConfig, name: e.target.value })
                    }
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-neu-text-muted">
                    Role / Title
                  </span>
                  <input
                    value={heroConfig.role || ""}
                    onChange={(e) =>
                      setHeroConfig({ ...heroConfig, role: e.target.value })
                    }
                    placeholder="e.g. Backend Engineer & AI Integrator"
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-neu-text-muted">
                    Headline
                  </span>
                  <input
                    value={heroConfig.headline || ""}
                    onChange={(e) =>
                      setHeroConfig({
                        ...heroConfig,
                        headline: e.target.value,
                      })
                    }
                    placeholder="e.g. Production Systems at Scale"
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-neu-text-muted">
                    Availability Status Text
                  </span>
                  <input
                    value={heroConfig.statusText || ""}
                    onChange={(e) =>
                      setHeroConfig({
                        ...heroConfig,
                        statusText: e.target.value,
                      })
                    }
                    placeholder="e.g. Available for Remote Roles (UTC+7)"
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <span className="text-xs font-mono text-neu-text-muted">
                    Core Quote / Positioning Statement
                  </span>
                  <input
                    value={heroConfig.quote || ""}
                    onChange={(e) =>
                      setHeroConfig({
                        ...heroConfig,
                        quote: e.target.value,
                      })
                    }
                    placeholder="e.g. I ship LLM integrations into production — not train models in notebooks."
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <span className="text-xs font-mono text-neu-text-muted">
                    Documentation URL
                  </span>
                  <input
                    value={heroConfig.docsUrl || ""}
                    onChange={(e) =>
                      setHeroConfig({
                        ...heroConfig,
                        docsUrl: e.target.value,
                      })
                    }
                    placeholder="https://sb.awaluddin.dev/docs"
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-neu-text-muted">
                      Long About Story / Bio (Markdown & Paragraphs supported)
                    </span>
                    <span className="text-[11px] font-mono text-neu-text-muted">
                      Displayed in #about section
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    value={heroConfig.aboutText || ""}
                    onChange={(e) =>
                      setHeroConfig({
                        ...heroConfig,
                        aboutText: e.target.value,
                      })
                    }
                    placeholder="Write your long-form about text here. Multi-line paragraphs will render formatted on the public homepage. If empty, the default engineering narrative is displayed."
                    className="w-full px-4 py-3 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent leading-relaxed resize-y font-sans"
                  />
                </div>
              </div>

              {/* Metric Strip Form */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neu-text-muted">
                    Operational & Production Metrics (Max 4 recommended)
                  </span>
                  <button
                    type="button"
                    onClick={addMetric}
                    className="text-xs font-bold text-neu-accent hover:underline flex items-center gap-1"
                    name="Add Metric"
                  >
                    <Plus size={14} /> Add Metric
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metrics.map((m, idx) => (
                    <div
                      key={idx as number}
                      className="p-4 rounded-xl glass-card-inset border border-white/5 relative group space-y-3"
                    >
                      <button
                        type="button"
                        onClick={() => removeMetric(idx)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-neu-text-muted">
                            Value (e.g. $18K / yr, Sub-Second)
                          </span>
                          <input
                            value={m.value || ""}
                            onChange={(e) =>
                              handleMetricChange(idx, "value", e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-neu-text-muted">
                            Label
                          </span>
                          <input
                            value={m.label || ""}
                            onChange={(e) =>
                              handleMetricChange(idx, "label", e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-neu-text-muted">
                            Subtext (Badge)
                          </span>
                          <input
                            value={m.subtext || ""}
                            onChange={(e) =>
                              handleMetricChange(idx, "subtext", e.target.value)
                            }
                            placeholder="e.g. Documented Annual Impact"
                            className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-neu-text-muted">
                            Icon
                          </span>
                          <select
                            value={m.icon || "DollarSign"}
                            onChange={(e) =>
                              handleMetricChange(idx, "icon", e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50"
                          >
                            <option value="DollarSign">DollarSign (Cost)</option>
                            <option value="Zap">Zap (Speed/Latency)</option>
                            <option value="RefreshCw">RefreshCw (Fault-Tolerance/AI)</option>
                            <option value="ShieldCheck">ShieldCheck (Compliance)</option>
                            <option value="Server">Server</option>
                            <option value="Database">Database</option>
                            <option value="Cpu">Cpu</option>
                            <option value="Activity">Activity</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neu-text-muted">
                          Description
                        </span>
                        <textarea
                          rows={2}
                          value={m.description || ""}
                          onChange={(e) =>
                            handleMetricChange(idx, "description", e.target.value)
                          }
                          placeholder="Brief explanation of the achieved impact..."
                          className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-xs outline-none border border-transparent focus:border-neu-accent/50 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={cn(
              "fixed bottom-8 left-1/2 z-[200] px-6 py-3.5 rounded-2xl font-mono text-xs shadow-xl border flex items-center gap-2.5",
              toastMessage.type === "success"
                ? "bg-card text-emerald-400 border-subtle"
                : "bg-card text-red-400 border-red-500/50",
            )}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            <span>{toastMessage.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
