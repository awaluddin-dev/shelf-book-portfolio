"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { AdminProjectLinkedCards } from "@/shared/ui/admin/AdminProjectLinkedCards";

export default function AdminLifecycle() {
  return (
    <AdminProjectLinkedCards
      title="Project Lifecycle Tracker"
      activePath="/admin/lifecycle"
      apiEndpoint="/api/lifecycle"
      itemDataExtractor={(data) => Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])}
      defaultFormData={{ stage: 'Planning & Spec', date: '', title: '', description: '', evidentUrl: '', order: 0 }}
      onBeforeSave={(formData) => {
        const payload = { ...formData, order: Number(formData.order) };
        if (!payload.evidentUrl) {
          delete payload.evidentUrl;
        }
        return payload;
      }}
      renderForm={(formData, setFormData) => (
        <>
          <div className="flex gap-4">
            <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="w-1/3 px-3 py-2 rounded-lg glass-card-inset text-sm outline-none border border-transparent focus:border-neu-accent">
              <option value="Planning & Spec">Planning & Spec</option>
              <option value="Architecture & Design">Architecture & Design</option>
              <option value="Execution & Code">Execution & Code</option>
              <option value="Testing & Launch">Testing & Launch</option>
            </select>
            <input placeholder="Date (e.g. Jan 2026)" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-1/3 px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
            <input placeholder="Order (e.g. 0)" type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-20 px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
          </div>
          <input placeholder="Title (e.g. Initial Architecture Design)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none min-h-[80px]" />
          <input placeholder="Evidence URL (e.g. https://link-to-pdf.com) - Optional" value={formData.evidentUrl || ''} onChange={e => setFormData({...formData, evidentUrl: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
        </>
      )}
      renderCardDisplay={(item: any) => (
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full glass-card-inset flex items-center justify-center font-bold text-neu-accent shrink-0">
              {item.order || 0}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded text-neu-text-muted">{item.stage}</span>
                <span className="text-[10px] font-mono font-bold text-neu-accent">{item.date}</span>
              </div>
              <h3 className="font-bold text-lg text-neu-text mb-1">{item.title}</h3>
              <p className="font-medium text-neu-text-muted text-sm">{item.description}</p>
              
              {item.evidentUrl && (
                <a href={item.evidentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-500 hover:text-blue-600 mt-3 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-colors">
                  <ExternalLink size={12} /> View Evidence
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}
