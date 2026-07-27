"use client";

import { useState, useEffect } from "react";
import { Loader } from "@/shared/ui/Loader";
import { AdminSidebar } from "@/widgets/admin-sidebar/ui/AdminSidebar";
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
  const [heroConfig, setHeroConfig] = useState<any>({ name: '', role: '' });
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
      const payload = JSON.parse(atob(token.split('.')[1]));
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
      fetch("/api/hero").then((res) => res.json()),
    ]).then(([statusData, testData, heroData]) => {
      
      let testExtracted = [];
      if (testData.data?.testimonials) { testExtracted = testData.data.testimonials; }
      else if (testData.testimonials) { testExtracted = testData.testimonials; }
      else if (Array.isArray(testData.data)) { testExtracted = testData.data; }
      else if (Array.isArray(testData)) { testExtracted = testData; }
      setTestimonials(testExtracted);

      const actualHeroConfig = heroData.data?.heroConfig || heroData.heroConfig;
      setHeroConfig(actualHeroConfig || {});

      let metricsExtracted = [];
      if (heroData.data?.metrics) { metricsExtracted = heroData.data.metrics; }
      else if (heroData.metrics) { metricsExtracted = heroData.metrics; }
      else if (Array.isArray(heroData.data)) { metricsExtracted = heroData.data; }
      else if (Array.isArray(heroData)) { metricsExtracted = heroData; }
      setMetrics(metricsExtracted);
      
      setLoading(false);
    });
  }, [router]);

  const saveHeroConfig = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/hero", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ heroConfig, metrics }),
      });
      if (!res.ok) throw new Error("Failed");
      setToastMessage({
        message: "Hero Section updated successfully",
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
        icon: "Code2",
        isSavings: false,
      },
    ]);
  };

  const removeMetric = (index: number) => {
    const newMetrics = [...metrics];
    newMetrics.splice(index, 1);
    setMetrics(newMetrics);
  };

  return (
    <div className="min-h-screen bg-neu-bg flex text-neu-text">
      {isProcessing && <Loader fullScreen text="Processing..." />}
      {/* Sidebar */}
      <AdminSidebar activePath="/admin/dashboard" />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
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
                <div
                  className={cn(
                    "text-sm font-bold transition-colors duration-300",
                    heroConfig.openForWork
                      ? "text-emerald-500"
                      : "text-amber-500",
                  )}
                >
                  {heroConfig.openForWork
                    ? "Open to Opportunities"
                    : "Closed to Opportunities"}
                </div>
                <button
                  onClick={() => setHeroConfig({ ...heroConfig, openForWork: !heroConfig.openForWork })}
                  className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200 dark:bg-zinc-850 shadow-inner transition-colors duration-200 focus:outline-none cursor-pointer"
                >
                  <span
                    className={cn(
                      "inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200",
                      heroConfig.openForWork
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
                  <label className="text-xs font-mono text-neu-text-muted">Display Name</label>
                  <input
                    value={heroConfig.name || ''}
                    onChange={(e) => setHeroConfig({ ...heroConfig, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neu-text-muted">Role / Title</label>
                  <input
                    value={heroConfig.role || ''}
                    onChange={(e) => setHeroConfig({ ...heroConfig, role: e.target.value })}
                    placeholder="e.g. Backend Engineer"
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neu-text-muted">Available From</label>
                  <input
                    value={heroConfig.availableFrom || ''}
                    onChange={(e) => setHeroConfig({ ...heroConfig, availableFrom: e.target.value })}
                    placeholder="e.g. Now, Jan 2027"
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
              </div>

              {/* Metric Strip Form */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-neu-text-muted">
                    Metric Strip Items (Max 4 recommended)
                  </label>
                  <button
                    type="button"
                    onClick={addMetric}
                    className="text-xs font-bold text-neu-accent hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Metric
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl glass-card-inset border border-white/5 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => removeMetric(idx)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-neu-text-muted">
                              Value (e.g. 5+ Years)
                            </label>
                            <input
                              value={m.value || ""}
                              onChange={(e) =>
                                handleMetricChange(idx, "value", e.target.value)
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-neu-text-muted">
                              Label (e.g. EXPERIENCE)
                            </label>
                            <input
                              value={m.label}
                              onChange={(e) =>
                                handleMetricChange(idx, "label", e.target.value)
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-neu-text-muted">
                              Icon Name
                            </label>
                            <select
                              value={m.icon}
                              onChange={(e) =>
                                handleMetricChange(idx, "icon", e.target.value)
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50"
                            >
                              <option value="Code2">Code2</option>
                              <option value="Briefcase">Briefcase</option>
                              <option value="TrendingUp">TrendingUp</option>
                              <option value="MapPin">MapPin</option>
                              <option value="Cpu">Cpu</option>
                              <option value="Zap">Zap</option>
                              <option value="Activity">Activity</option>
                              <option value="Award">Award</option>
                              <option value="Terminal">Terminal</option>
                              <option value="Server">Server</option>
                              <option value="Database">Database</option>
                              <option value="Box">Box</option>
                              <option value="Layers">Layers</option>
                              <option value="Cloud">Cloud</option>
                            </select>
                          </div>
                          <div className="space-y-1 flex flex-col justify-end">
                            <label className="flex items-center gap-2 text-xs font-mono text-neu-text-muted cursor-pointer py-1.5">
                              <input
                                type="checkbox"
                                checked={m.isSavings}
                                onChange={(e) =>
                                  handleMetricChange(
                                    idx,
                                    "isSavings",
                                    e.target.checked,
                                  )
                                }
                                className="rounded bg-black/5 dark:bg-white/5 border-transparent text-neu-accent focus:ring-neu-accent"
                              />{' '}
                              Highlight (Savings)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={cn(
              "fixed bottom-8 left-1/2 z-[200] px-6 py-3.5 rounded-2xl font-mono text-xs shadow-neu border backdrop-blur-md flex items-center gap-2.5",
              toastMessage.type === "success"
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-red-500/10 text-red-500 border-red-500/20",
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
    </div>
  );
}
