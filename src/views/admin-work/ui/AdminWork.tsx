"use client";

import React, { useState } from "react";
import { AdminCrudTable } from "@/widgets/admin-crud-table/ui/AdminCrudTable";
import { Eye, X } from "lucide-react";

export default function AdminWork() {
  const [viewingWork, setViewingWork] = useState<any>(null);

  return (
    <>
      <AdminCrudTable
        title="Career Experience (v2)"
        itemName="Career Experience"
        apiEndpoint="/api/v2/experience"
        dataExtractor={(data) => {
          if (data.data?.experiences) return data.data.experiences;
          if (data.experiences) return data.experiences;
          if (Array.isArray(data.data)) return data.data;
          if (Array.isArray(data)) return data;
          return [];
        }}
        defaultFormData={{
          company: "",
          role: "",
          period: "",
          isActive: false,
          bullets: "",
          techTags: "",
          order: 1,
        }}
        onBeforeSave={(formData) => {
          let bulletsArray = formData.bullets;
          if (typeof formData.bullets === "string") {
            try {
              bulletsArray = JSON.parse(formData.bullets);
            } catch {
              bulletsArray = formData.bullets
                .split("\n")
                .map((line: string) => line.trim())
                .filter(Boolean)
                .map((text: string) => ({
                  situation: text,
                  action: "",
                  metric: "",
                }));
            }
          }
          let techTagsArray = formData.techTags;
          if (typeof formData.techTags === "string") {
            techTagsArray = formData.techTags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean);
          }
          return {
            ...formData,
            bullets: bulletsArray,
            techTags: techTagsArray,
            order: Number(formData.order) || 1,
          };
        }}
        customActions={(item: any) => (
          <button
            type="button"
            onClick={() => setViewingWork(item)}
            className="p-2 rounded-xl glass-card text-neu-text-muted hover:text-neu-text hover:scale-105 active:scale-95 transition-all"
            title="View Detail"
          >
            <Eye size={16} />
          </button>
        )}
        columns={[
          {
            header: "Role & Company",
            render: (item: any) => (
              <>
                <div className="font-bold text-neu-text">{item.role}</div>
                <div className="text-xs text-neu-text-muted mt-1">
                  {item.company}
                </div>
              </>
            ),
          },
          {
            header: "Period",
            render: (item: any) => (
              <>
                <div className="text-xs font-bold text-neu-accent">
                  {item.period}
                </div>
                {item.isActive && (
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                    Current Active
                  </span>
                )}
              </>
            ),
          },
        ]}
        renderForm={(formData, setFormData) => (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="company-adminWork"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Company
                </label>
                <input
                  required
                  id="company-adminWork"
                  value={formData.company || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                  placeholder="e.g. PT Serasi Autoraya (SERA)"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="role-adminWork"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Role
                </label>
                <input
                  required
                  id="role-adminWork"
                  value={formData.role || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                  placeholder="e.g. Backend Engineer"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1 col-span-2">
                <label
                  htmlFor="period-adminWork"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Period
                </label>
                <input
                  required
                  id="period-adminWork"
                  value={formData.period || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                  placeholder="e.g. 2024 – Present"
                />
              </div>
              <div className="space-y-1 flex flex-col justify-end pb-2">
                <label className="flex items-center gap-2 text-xs font-mono text-neu-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isActive)}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded bg-black/5 dark:bg-white/5 border-transparent text-neu-accent focus:ring-neu-accent"
                  />
                  Current Active Role
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="tags-adminWork"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Tech Tags (Comma separated)
                </label>
                <input
                  id="tags-adminWork"
                  value={
                    Array.isArray(formData.techTags)
                      ? formData.techTags.join(", ")
                      : formData.techTags || ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, techTags: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                  placeholder="Go, Node.js, Azure Service Bus"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="order-adminWork"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Display Order
                </label>
                <input
                  type="number"
                  id="order-adminWork"
                  value={formData.order || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label
                htmlFor="bullets-adminWork"
                className="text-xs font-mono text-neu-text-muted"
              >
                Bullets (JSON Array of &#123; situation, action, metric, metricSuffix? &#125; or lines of text)
              </label>
              <textarea
                required
                id="bullets-adminWork"
                rows={6}
                value={
                  typeof formData.bullets === "object"
                    ? JSON.stringify(formData.bullets, null, 2)
                    : formData.bullets || ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, bullets: e.target.value })
                }
                className="w-full font-mono text-xs px-4 py-2.5 rounded-xl glass-card-inset border border-white/5 focus:border-neu-accent outline-none"
                placeholder='[&#10;  {&#10;    "situation": "Managing telemetry,",&#10;    "action": "engineered event-driven microservices, achieving",&#10;    "metric": "99.9% uptime",&#10;    "metricSuffix": " across operations."&#10;  }&#10;]'
              />
            </div>
          </>
        )}
      />

      {/* View Detail Modal */}
      {viewingWork && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative border border-subtle max-h-[85vh] overflow-y-auto hide-scrollbar">
            <button
              type="button"
              onClick={() => setViewingWork(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-canvas hover:bg-card text-secondary hover:text-primary transition-colors border border-subtle"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold font-display mb-6 text-primary">
              Work Experience Detail
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-1">
                  Role & Company
                </h4>
                <p className="text-lg font-bold text-neu-text">
                  {viewingWork.role} at {viewingWork.company}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-mono text-neu-text-muted mb-1">
                    Period
                  </h4>
                  <p className="text-base font-medium text-neu-text">
                    {viewingWork.period}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-mono text-neu-text-muted mb-1">
                    Status
                  </h4>
                  <p className="text-base font-medium text-neu-text">
                    {viewingWork.isActive ? "Current Active Role" : "Past Role"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-1">
                  Tech Tags
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(Array.isArray(viewingWork.techTags) ? viewingWork.techTags : []).map((tag: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-canvas border border-subtle text-xs font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-2">
                  Impact Bullets
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-neu-text">
                  {(Array.isArray(viewingWork.bullets)
                    ? viewingWork.bullets
                    : []
                  ).map((b: any, i: number) => (
                    <li key={i}>
                      {typeof b === "string" ? b : (
                        <span>
                          {b.situation} {b.action}{" "}
                          <strong className="text-brand font-mono">{b.metricPrefix}{b.metric}</strong>
                          {b.metricSuffix}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingWork(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-neu-accent hover:shadow-neu-sm transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
