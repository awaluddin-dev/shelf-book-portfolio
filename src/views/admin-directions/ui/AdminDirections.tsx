"use client";

import React from "react";
import { AdminCrudTable } from "@/widgets/admin-crud-table/ui/AdminCrudTable";
import { Compass, Sparkles, Clock, ExternalLink } from "lucide-react";

export function AdminDirections() {
  return (
    <div className="space-y-6">
      <div className="border-b border-subtle pb-4">
        <h1 className="text-xl font-display font-bold text-neu-text flex items-center gap-2">
          <Compass className="text-neu-accent" size={22} />
          <span>Current & Future Directions (v2)</span>
        </h1>
        <p className="text-xs text-neu-text-muted mt-1">
          Manage what you are doing right now (Current Focus) and your quarterly roadmap (Future Directions).
        </p>
      </div>

      <AdminCrudTable
        title="Directions & Roadmap Items"
        itemName="Direction Item"
        apiEndpoint="/api/v2/directions"
        dataExtractor={(data) => {
          if (Array.isArray(data)) return data;
          if (Array.isArray(data.data)) return data.data;
          // If grouped response:
          const current = data.current || data.data?.current || [];
          const future = data.future || data.data?.future || [];
          return [...current, ...future];
        }}
        defaultFormData={{
          title: "",
          category: "learning",
          type: "current",
          quarter: "Q1 2026",
          status: "in_progress",
          description: "",
          depth: "",
          tags: "",
          icon: "BrainCircuit",
          link: "",
          linkText: "",
          order: 0,
        }}
        onBeforeSave={(formData) => {
          let tagsArr: string[] = [];
          if (Array.isArray(formData.tags)) {
            tagsArr = formData.tags;
          } else if (typeof formData.tags === "string") {
            tagsArr = formData.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean);
          }
          return {
            ...formData,
            order: Number(formData.order) || 0,
            tags: tagsArr,
          };
        }}
        columns={[
          {
            header: "Title & Category",
            render: (item: any) => (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neu-accent/15 text-neu-accent uppercase font-bold">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      item.type === "current"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-neu-surface text-neu-text-muted border border-subtle"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
                <div className="font-bold text-neu-text text-sm">{item.title}</div>
                <div className="text-xs text-neu-text-muted line-clamp-1 max-w-md">
                  {item.description}
                </div>
              </div>
            ),
          },
          {
            header: "Quarter & Timeline",
            render: (item: any) => (
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-neu-accent flex items-center gap-1">
                  <Clock size={12} />
                  <span>{item.quarter}</span>
                </div>
                <span className="inline-block text-[10px] font-mono text-neu-text-muted bg-neu-surface px-1.5 py-0.5 rounded border border-subtle">
                  Status: {item.status}
                </span>
              </div>
            ),
          },
          {
            header: "Target / Depth",
            render: (item: any) => (
              <div className="text-xs text-neu-text-muted">
                {item.depth ? <span>{item.depth}</span> : <span className="opacity-50">—</span>}
              </div>
            ),
          },
          {
            header: "Link",
            render: (item: any) =>
              item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs font-mono text-neu-accent hover:underline flex items-center gap-1"
                >
                  <span>{item.linkText || "Link"}</span>
                  <ExternalLink size={11} />
                </a>
              ) : (
                <span className="text-xs text-neu-text-muted opacity-50">—</span>
              ),
          },
        ]}
        renderForm={(formData, setFormData) => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Distributed Event Streaming with Kafka"
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Quarter *</label>
                <input
                  type="text"
                  required
                  value={formData.quarter || ""}
                  onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                  placeholder="e.g. Q1 2026, Q2 2026"
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Type *</label>
                <select
                  value={formData.type || "current"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                >
                  <option value="current">Current (Right Now)</option>
                  <option value="future">Future (Roadmap Timeline)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Category *</label>
                <select
                  value={formData.category || "learning"}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                >
                  <option value="learning">learning</option>
                  <option value="project">project</option>
                  <option value="architecture">architecture</option>
                  <option value="system">system</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Status</label>
                <select
                  value={formData.status || "in_progress"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                >
                  <option value="in_progress">in_progress</option>
                  <option value="planned">planned</option>
                  <option value="completed">completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Description *</label>
              <textarea
                rows={3}
                required
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details of the endeavor, architectural scope, or research findings..."
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Depth / Target</label>
                <input
                  type="text"
                  value={formData.depth || ""}
                  onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                  placeholder="e.g. Production Deep Dive, MVP Launch"
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Icon Name</label>
                <input
                  type="text"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="BrainCircuit, Layers, Cpu, Cloud, Zap, Server, Terminal"
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Tags (comma-separated)</label>
              <input
                type="text"
                value={
                  Array.isArray(formData.tags)
                    ? formData.tags.join(", ")
                    : formData.tags || ""
                }
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Kafka, NestJS, Go, Redis"
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Link URL</label>
                <input
                  type="url"
                  value={formData.link || ""}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Link Label</label>
                <input
                  type="text"
                  value={formData.linkText || ""}
                  onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                  placeholder="e.g. View Repository"
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="w-32 space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Order Priority</label>
              <input
                type="number"
                value={formData.order ?? 0}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default AdminDirections;
