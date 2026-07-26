"use client";

import React from "react";
import { AdminProjectLinkedCards } from "@/shared/ui/admin/AdminProjectLinkedCards";

export default function AdminArchitecture() {
  return (
    <AdminProjectLinkedCards
      title="System Architecture Nodes"
      activePath="/admin/architecture"
      apiEndpoint="/api/architecture"
      itemDataExtractor={(data) => {
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
      }}
      defaultFormData={{ name: '', title: '', description: '', metrics: '', order: 0 }}
      onBeforeSave={(formData) => ({
        ...formData,
        order: Number(formData.order)
      })}
      renderForm={(formData, setFormData) => (
        <>
          <div className="flex gap-4">
            <input placeholder="Node ID (e.g. gateway)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-1/3 px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
            <input placeholder="Order (e.g. 0)" type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-20 px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
          </div>
          <input placeholder="Title (e.g. NestJS Gateway)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none min-h-[100px]" />
          <input placeholder="KPI/Metrics (e.g. Response: <12ms)" value={formData.metrics} onChange={e => setFormData({...formData, metrics: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
        </>
      )}
      renderCardDisplay={(item: any) => (
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full glass-card-inset flex items-center justify-center font-bold text-neu-accent shrink-0">
              {item.order}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded text-neu-text-muted">{item.name}</span>
                <h3 className="font-bold text-lg text-neu-accent">{item.title}</h3>
              </div>
              <p className="font-medium text-neu-text mb-2 text-sm">{item.description}</p>
              <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{item.metrics}</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
