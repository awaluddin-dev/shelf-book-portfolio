"use client";

import React from "react";
import { AdminProjectLinkedCards } from "@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards";

export default function AdminTechnicalImagery() {
  return (
    <AdminProjectLinkedCards
      title="Technical Imagery"
      apiEndpoint="/api/technical-imagery"
      itemDataExtractor={(data) => {
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
      }}
      defaultFormData={{
        featured: '',
        blueprint: '',
        metrics: '',
        featuredCaption: '',
        blueprintCaption: '',
        metricsCaption: ''
      }}
      renderForm={(formData, setFormData) => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neu-text-muted mb-1 block">Featured Image URL</label>
              <input value={formData.featured || ''} onChange={e => setFormData({...formData, featured: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-neu-text-muted mb-1 block">Featured Caption</label>
              <input value={formData.featuredCaption || ''} onChange={e => setFormData({...formData, featuredCaption: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neu-text-muted mb-1 block">Blueprint Image URL</label>
              <input value={formData.blueprint || ''} onChange={e => setFormData({...formData, blueprint: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-neu-text-muted mb-1 block">Blueprint Caption</label>
              <input value={formData.blueprintCaption || ''} onChange={e => setFormData({...formData, blueprintCaption: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neu-text-muted mb-1 block">Metrics Image URL</label>
              <input value={formData.metrics || ''} onChange={e => setFormData({...formData, metrics: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-neu-text-muted mb-1 block">Metrics Caption</label>
              <input value={formData.metricsCaption || ''} onChange={e => setFormData({...formData, metricsCaption: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
            </div>
          </div>
        </div>
      )}
      renderCardDisplay={(item: any) => (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-neu-text-muted uppercase tracking-wider">Featured</span>
              <div className="w-full aspect-video rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden flex items-center justify-center">
                {item.featured ? (
                  <img src={item.featured} alt="Featured" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-zinc-500 italic">No image</span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 italic">{item.featuredCaption || 'No caption'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-neu-text-muted uppercase tracking-wider">Blueprint</span>
              <div className="w-full aspect-video rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden flex items-center justify-center">
                {item.blueprint ? (
                  <img src={item.blueprint} alt="Blueprint" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-zinc-500 italic">No image</span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 italic">{item.blueprintCaption || 'No caption'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-neu-text-muted uppercase tracking-wider">Metrics</span>
              <div className="w-full aspect-video rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden flex items-center justify-center">
                {item.metrics ? (
                  <img src={item.metrics} alt="Metrics" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-zinc-500 italic">No image</span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 italic">{item.metricsCaption || 'No caption'}</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
