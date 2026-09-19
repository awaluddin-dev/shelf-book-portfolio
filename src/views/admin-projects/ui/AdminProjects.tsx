"use client";

import React, { useState } from "react";
import { AdminCrudTable } from "@/widgets/admin-crud-table/ui/AdminCrudTable";
import { Trash2, UploadCloud } from "lucide-react";

export default function AdminProjects() {
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const defaultForm = {
    title: "",
    subtitle: "",
    category: "",
    tags: "",
    domainBadge: "",
    problem: "",
    solution: "",
    pipelineFlow: "",
    spineColor: "#0f4c75",
    coverColor: "#142028",
    spineText: "",
    date: "2024",
    demoUrl: "",
    github: "",
    markdown: "",
    order: 1,
    isFeatured: false,
    mediaType: "screenshot",
    mediaUrl: "",
    architectureDiagram: "",
    keyHighlights: "",
    stats: [] as { label: string; value: string }[],
    phases: [] as { date: string; title: string; description: string }[],
  };

  return (
    <AdminCrudTable
      title="Portfolio Projects (v2)"
      itemName="Project"
      apiEndpoint="/api/v2/projects"
      dataExtractor={(data) => {
        if (data.data?.projects) return data.data.projects;
        if (data.projects) return data.projects;
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
      }}
      defaultFormData={defaultForm}
      onBeforeSave={(formData) => ({
        ...formData,
        tags:
          typeof formData.tags === "string"
            ? formData.tags
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : formData.tags,
        pipelineFlow:
          typeof formData.pipelineFlow === "string"
            ? formData.pipelineFlow
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : formData.pipelineFlow,
        keyHighlights:
          typeof formData.keyHighlights === "string"
            ? formData.keyHighlights
                .split("\n")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : formData.keyHighlights,
        isFeatured: Boolean(formData.isFeatured),
        order: Number(formData.order) || 1,
      })}
      columns={[
        {
          header: "Title",
          render: (item: any) => (
            <>
              <div className="flex items-center gap-2 font-bold">
                {item.title}
                {item.isFeatured && (
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wide bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Featured
                  </span>
                )}
              </div>
              <div className="text-xs text-neu-text-muted truncate max-w-[250px]">
                {item.subtitle}
              </div>
            </>
          ),
        },
        {
          header: "Category",
          render: (item: any) => (
            <span className="px-2 py-1 rounded-md glass-card-inset text-xs font-mono text-neu-accent">
              {item.category}
            </span>
          ),
        },
        {
          header: "Date",
          render: (item: any) => <span className="text-sm">{item.date}</span>,
        },
      ]}
      renderForm={(formData, setFormData) => {
        const handleUpload = async (file: File, fieldName: "mediaUrl" | "architectureDiagram") => {
          const token = localStorage.getItem("token");
          setUploadingField(fieldName);
          try {
            const uploadData = new FormData();
            uploadData.append("file", file);

            const res = await fetch("/api/v2/projects/upload", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: uploadData,
            });

            const result = await res.json();
            const data = result.data || result;
            if (data.url) {
              setFormData((prev: any) => ({
                ...prev,
                [fieldName]: data.url,
              }));
            }
          } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload asset");
          } finally {
            setUploadingField(null);
          }
        };

        const addStat = () =>
          setFormData({
            ...formData,
            stats: [...formData.stats, { label: "", value: "" }],
          });
        const updateStat = (index: number, field: string, value: string) => {
          const newStats = [...formData.stats];
          newStats[index] = { ...newStats[index], [field]: value };
          setFormData({ ...formData, stats: newStats });
        };
        const removeStat = (index: number) => {
          const newStats = [...formData.stats];
          newStats.splice(index, 1);
          setFormData({ ...formData, stats: newStats });
        };

        const addPhase = () =>
          setFormData({
            ...formData,
            phases: [
              ...formData.phases,
              { date: "", title: "", description: "" },
            ],
          });
        const updatePhase = (index: number, field: string, value: string) => {
          const newPhases = [...formData.phases];
          newPhases[index] = { ...newPhases[index], [field]: value };
          setFormData({ ...formData, phases: newPhases });
        };
        const removePhase = (index: number) => {
          const newPhases = [...formData.phases];
          newPhases.splice(index, 1);
          setFormData({ ...formData, phases: newPhases });
        };

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-title"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Title
                </label>
                <input
                  id="adm-proj-title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-subtitle"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Subtitle
                </label>
                <input
                  id="adm-proj-subtitle"
                  required
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-category"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Category
                </label>
                <input
                  id="adm-proj-category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-date"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Date
                </label>
                <input
                  id="adm-proj-date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-dbadge"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Domain Badge (e.g. AI Systems & Distributed Queue)
                </label>
                <input
                  id="adm-proj-dbadge"
                  value={formData.domainBadge || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, domainBadge: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  placeholder="AI Systems & Distributed Queue"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-pflow"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Pipeline Flow (Comma separated steps)
                </label>
                <input
                  id="adm-proj-pflow"
                  value={
                    Array.isArray(formData.pipelineFlow)
                      ? formData.pipelineFlow.join(", ")
                      : formData.pipelineFlow || ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, pipelineFlow: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  placeholder="Gateway, Redis BullMQ, LangGraph, PostgreSQL"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-psolved"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Problem
                </label>
                <textarea
                  id="adm-proj-psolved"
                  value={formData.problem || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, problem: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent resize-none"
                  placeholder="Core technical problem addressed..."
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-solution"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Solution & Architecture
                </label>
                <textarea
                  id="adm-proj-solution"
                  value={formData.solution || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, solution: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent resize-none"
                  placeholder="Engineering solution implemented..."
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-tags"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Tags (comma separated)
                </label>
                <input
                  id="adm-proj-tags"
                  required
                  value={
                    Array.isArray(formData.tags)
                      ? formData.tags.join(", ")
                      : formData.tags || ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-order"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Display Order
                </label>
                <input
                  id="adm-proj-order"
                  type="number"
                  value={formData.order || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, order: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-scolor"
                  className="text-xs font-mono text-neu-text-muted uppercase"
                >
                  Spine Color
                </label>
                <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl glass-card-inset">
                  <input
                    id="adm-proj-scolor"
                    type="color"
                    required
                    value={formData.spineColor}
                    onChange={(e) =>
                      setFormData({ ...formData, spineColor: e.target.value })
                    }
                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
                  />
                  <span className="text-sm font-mono text-neu-text">
                    {formData.spineColor}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-ccolor"
                  className="text-xs font-mono text-neu-text-muted uppercase"
                >
                  Cover Color
                </label>
                <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl glass-card-inset">
                  <input
                    id="adm-proj-ccolor"
                    type="color"
                    required
                    value={formData.coverColor}
                    onChange={(e) =>
                      setFormData({ ...formData, coverColor: e.target.value })
                    }
                    className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
                  />
                  <span className="text-sm font-mono text-neu-text">
                    {formData.coverColor}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-stext"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Spine Text
                </label>
                <input
                  id="adm-proj-stext"
                  required
                  value={formData.spineText}
                  onChange={(e) =>
                    setFormData({ ...formData, spineText: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-gurl"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  GitHub URL
                </label>
                <input
                  id="adm-proj-gurl"
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-durlopt"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Demo URL (Optional)
                </label>
                <input
                  id="adm-proj-durlopt"
                  value={formData.demoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, demoUrl: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
            </div>

            {/* Featured Project Showcase Controls */}
            <div className="p-4 border border-amber-500/20 rounded-2xl space-y-4 bg-amber-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-amber-300">Featured Project Showcase</h3>
                  <p className="text-xs text-neu-text-muted">Display this project prominently with media previews, architecture diagrams, and recruiter highlights on the home view.</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isFeatured)}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-neu-accent border-gray-600 focus:ring-neu-accent bg-transparent"
                  />
                  <span className="text-xs font-mono font-medium text-amber-200">Set as Featured</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="adm-proj-mtype"
                    className="text-xs font-mono text-neu-text-muted"
                  >
                    Media Type
                  </label>
                  <select
                    id="adm-proj-mtype"
                    value={formData.mediaType || "screenshot"}
                    onChange={(e) =>
                      setFormData({ ...formData, mediaType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent bg-black/20"
                  >
                    <option value="screenshot">Screenshot / Image</option>
                    <option value="gif">Animated GIF</option>
                    <option value="video">Interactive Video</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="adm-proj-murl"
                      className="text-xs font-mono text-neu-text-muted"
                    >
                      Media Preview URL (GIF, Screenshot, or Video)
                    </label>
                    <label className="text-[11px] font-mono text-neu-accent hover:underline cursor-pointer flex items-center gap-1">
                      <UploadCloud size={12} />
                      <span>{uploadingField === "mediaUrl" ? "Uploading..." : "Upload File"}</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        disabled={uploadingField !== null}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(f, "mediaUrl");
                        }}
                      />
                    </label>
                  </div>
                  <input
                    id="adm-proj-murl"
                    value={formData.mediaUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, mediaUrl: e.target.value })
                    }
                    placeholder="/api/v2/projects/assets/... or https://..."
                    className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="adm-proj-archdiag"
                    className="text-xs font-mono text-neu-text-muted"
                  >
                    Architecture Diagram Image URL
                  </label>
                  <label className="text-[11px] font-mono text-neu-accent hover:underline cursor-pointer flex items-center gap-1">
                    <UploadCloud size={12} />
                    <span>{uploadingField === "architectureDiagram" ? "Uploading..." : "Upload Diagram"}</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      disabled={uploadingField !== null}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(f, "architectureDiagram");
                      }}
                    />
                  </label>
                </div>
                <input
                  id="adm-proj-archdiag"
                  value={formData.architectureDiagram || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, architectureDiagram: e.target.value })
                  }
                  placeholder="/api/v2/projects/assets/... or https://..."
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="adm-proj-khighlights"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Key Highlights / Engineering Impact (One bullet per line)
                </label>
                <textarea
                  id="adm-proj-khighlights"
                  value={
                    Array.isArray(formData.keyHighlights)
                      ? formData.keyHighlights.join("\n")
                      : formData.keyHighlights || ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, keyHighlights: e.target.value })
                  }
                  rows={3}
                  placeholder="Architected distributed BullMQ queue processing 10k+ jobs/sec&#10;Sub-50ms p99 latency across all edge nodes&#10;Zero downtime migration with LangGraph checkpointing"
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent"
                />
              </div>
            </div>

            {/* Dynamic Stats */}
            <div className="p-4 border border-white/5 rounded-2xl space-y-4 bg-black/5 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Highlight Stats</h3>
                <button
                  type="button"
                  onClick={addStat}
                  className="text-xs font-bold text-neu-accent"
                >
                  Add Stat
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.stats.map((stat: any, i: number) => (
                  <div key={i as number} className="flex items-center gap-2">
                    <input
                      placeholder="Label"
                      value={stat.label}
                      onChange={(e) => updateStat(i, "label", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent"
                    />
                    <input
                      placeholder="Value"
                      value={stat.value}
                      onChange={(e) => updateStat(i, "value", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(i)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Phases */}
            <div className="p-4 border border-white/5 rounded-2xl space-y-4 bg-black/5 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Project Phases</h3>
                <button
                  type="button"
                  onClick={addPhase}
                  className="text-xs font-bold text-neu-accent"
                >
                  Add Phase
                </button>
              </div>
              <div className="space-y-3">
                {formData.phases.map((phase: any, i: number) => (
                  <div
                    key={i as number}
                    className="flex flex-col gap-2 p-3 border border-white/10 rounded-xl relative"
                  >
                    <button
                      type="button"
                      onClick={() => removePhase(i)}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        placeholder="Date"
                        value={phase.date}
                        onChange={(e) => updatePhase(i, "date", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent"
                      />
                      <input
                        placeholder="Title"
                        value={phase.title}
                        onChange={(e) =>
                          updatePhase(i, "title", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={phase.description}
                      onChange={(e) =>
                        updatePhase(i, "description", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent min-h-[60px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="adm-proj-markdown"
                className="text-xs font-mono text-neu-text-muted"
              >
                Markdown Content
              </label>
              <textarea
                required
                value={formData.markdown}
                onChange={(e) =>
                  setFormData({ ...formData, markdown: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-mono outline-none focus:border-neu-accent border border-transparent min-h-[200px]"
              />
            </div>
          </div>
        );
      }}
    />
  );
}
