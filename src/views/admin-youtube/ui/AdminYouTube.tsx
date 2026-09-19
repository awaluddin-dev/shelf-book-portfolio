"use client";

import React from "react";
import { AdminCrudTable } from "@/widgets/admin-crud-table/ui/AdminCrudTable";
import { Tv, ExternalLink } from "lucide-react";

export function AdminYouTube() {
  return (
    <div className="space-y-6">
      <div className="border-b border-subtle pb-4">
        <h1 className="text-xl font-display font-bold text-neu-text flex items-center gap-2">
          <Tv className="text-neu-accent" size={22} />
          <span>YouTube Channel Videos (v2)</span>
        </h1>
        <p className="text-xs text-neu-text-muted mt-1">
          Manage featured and latest videos showcased on the Directions & Roadmap page. (Frontend displays up to 2 videos).
        </p>
      </div>

      <AdminCrudTable
        title="YouTube Channel Videos"
        itemName="YouTube Video"
        apiEndpoint="/api/v2/directions/youtube"
        dataExtractor={(data) => {
          if (Array.isArray(data)) return data;
          if (Array.isArray(data.data)) return data.data;
          return [];
        }}
        defaultFormData={{
          title: "",
          description: "",
          thumbnailUrl: "",
          videoUrl: "",
          duration: "",
          views: "",
          order: 0,
        }}
        columns={[
          {
            header: "Video & Preview",
            render: (item: any) => (
              <div className="flex items-center gap-3">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-16 h-10 object-cover rounded border border-subtle shrink-0"
                  />
                ) : (
                  <div className="w-16 h-10 rounded bg-neu-surface border border-subtle flex items-center justify-center shrink-0">
                    <Tv size={16} className="text-neu-text-muted" />
                  </div>
                )}
                <div className="space-y-0.5">
                  <div className="font-bold text-neu-text text-sm line-clamp-1">{item.title}</div>
                  <div className="text-xs text-neu-text-muted line-clamp-1 max-w-sm">
                    {item.description || "No description"}
                  </div>
                </div>
              </div>
            ),
          },
          {
            header: "Duration & Views",
            render: (item: any) => (
              <div className="text-xs font-mono text-neu-text-muted space-y-0.5">
                <div>Duration: <span className="text-neu-text">{item.duration || "—"}</span></div>
                <div>Views: <span className="text-neu-text">{item.views || "—"}</span></div>
              </div>
            ),
          },
          {
            header: "Order",
            render: (item: any) => (
              <span className="text-xs font-mono text-neu-accent">#{item.order ?? 0}</span>
            ),
          },
          {
            header: "Action Link",
            render: (item: any) => (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs font-mono text-neu-accent hover:underline flex items-center gap-1"
              >
                <span>Watch</span>
                <ExternalLink size={11} />
              </a>
            ),
          },
        ]}
        renderForm={(formData, setFormData) => (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Video Title *</label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Microservices Architecture with NestJS & Docker"
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Video URL *</label>
              <input
                type="url"
                required
                value={formData.videoUrl || ""}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Thumbnail URL</label>
              <input
                type="url"
                value={formData.thumbnailUrl || ""}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://img.youtube.com/vi/.../maxresdefault.jpg or Unsplash URL"
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Description</label>
              <textarea
                rows={2}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of what this video screencast covers..."
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Duration</label>
                <input
                  type="text"
                  value={formData.duration || ""}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 18:42"
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Views Count</label>
                <input
                  type="text"
                  value={formData.views || ""}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  placeholder="e.g. 1.2K"
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Order (0 = Featured)</label>
                <input
                  type="number"
                  value={formData.order ?? 0}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary focus:border-neu-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default AdminYouTube;
