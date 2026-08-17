"use client";

import React, { useState } from "react";
import { AdminCrudTable } from "@/widgets/admin-crud-table/ui/AdminCrudTable";
import { Eye, X } from "lucide-react";

export default function AdminWork() {
  const [viewingWork, setViewingWork] = useState<any>(null);

  return (
    <>
      <AdminCrudTable
        title="Work Experience"
        itemName="Experience"
        apiEndpoint="/api/work"
        dataExtractor={(data) => {
          if (data.data?.workExperience) return data.data.workExperience;
          if (data.workExperience) return data.workExperience;
          if (Array.isArray(data.data)) return data.data;
          if (Array.isArray(data)) return data;
          return [];
        }}
        defaultFormData={{
          years: "",
          duration: "",
          company: "",
          role: "",
          stack: "",
          teaser: "",
          fullImpact: "",
          bullets: "",
        }}
        onBeforeSave={(formData) => ({
          ...formData,
          bullets:
            typeof formData.bullets === "string"
              ? formData.bullets
                  .split("\n")
                  .map((b: string) => b.trim())
                  .filter(Boolean)
              : formData.bullets,
        })}
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
            header: "Duration",
            render: (item: any) => (
              <>
                <div className="text-xs font-bold text-neu-accent">
                  {item.years}
                </div>
                <div className="text-xs text-neu-text-muted">
                  {item.duration}
                </div>
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
                  placeholder="e.g. Acme Corp"
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
                  placeholder="e.g. Senior Engineer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="years-adminWork"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Years
                </label>
                <input
                  required
                  id="years-adminWork"
                  value={formData.years || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, years: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                  placeholder="e.g. 2022 - Present"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="duration-adminWork"
                  className="text-xs font-mono text-neu-text-muted"
                >
                  Duration
                </label>
                <input
                  required
                  id="duration-adminWork"
                  value={formData.duration || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                  placeholder="e.g. 2 yrs 5 mos"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label
                htmlFor="stack-adminWork"
                className="text-xs font-mono text-neu-text-muted"
              >
                Tech Stack
              </label>
              <input
                required
                id="stack-adminWork"
                value={formData.stack || ""}
                onChange={(e) =>
                  setFormData({ ...formData, stack: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none"
                placeholder="e.g. React, Node.js, AWS"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="teaser-adminWork"
                className="text-xs font-mono text-neu-text-muted"
              >
                Teaser
              </label>
              <textarea
                required
                id="teaser-adminWork"
                value={formData.teaser || ""}
                onChange={(e) =>
                  setFormData({ ...formData, teaser: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none"
                placeholder="Short description..."
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="fullImpact-adminWork"
                className="text-xs font-mono text-neu-text-muted"
              >
                Full Impact
              </label>
              <textarea
                required
                id="fullImpact-adminWork"
                value={formData.fullImpact || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullImpact: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none"
                placeholder="Detailed impact and responsibilities..."
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="bullets-adminWork"
                className="text-xs font-mono text-neu-text-muted"
              >
                Bullets (One per line)
              </label>
              <textarea
                required
                id="bullets-adminWork"
                value={
                  Array.isArray(formData.bullets)
                    ? formData.bullets.join("\n")
                    : formData.bullets || ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, bullets: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none"
                placeholder="Led a team of 5...&#10;Increased performance by 20%..."
              />
            </div>
          </>
        )}
      />

      {/* View Detail Modal */}
      {viewingWork && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neu-bg rounded-3xl shadow-neu-modal w-full max-w-2xl p-8 relative border border-white/5 max-h-[85vh] overflow-y-auto hide-scrollbar">
            <button
              type="button"
              onClick={() => setViewingWork(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neu-text transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold font-display mb-6">
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
                    Years
                  </h4>
                  <p className="text-base font-medium text-neu-text">
                    {viewingWork.years}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-mono text-neu-text-muted mb-1">
                    Duration
                  </h4>
                  <p className="text-base font-medium text-neu-text">
                    {viewingWork.duration}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-1">
                  Tech Stack
                </h4>
                <p className="text-base font-medium text-neu-text">
                  {viewingWork.stack}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-2">
                  Teaser
                </h4>
                <div className="p-4 rounded-xl glass-card-inset text-sm font-medium border border-white/5 whitespace-pre-wrap text-neu-text">
                  {viewingWork.teaser}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-2">
                  Full Impact
                </h4>
                <div className="p-4 rounded-xl glass-card-inset text-sm font-medium border border-white/5 whitespace-pre-wrap text-neu-text">
                  {viewingWork.fullImpact}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-2">
                  Key Achievements
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {(Array.isArray(viewingWork.bullets)
                    ? viewingWork.bullets
                    : []
                  ).map((b: string, i: number) => (
                    <li key={i as number} className="text-sm text-neu-text">
                      {b}
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
