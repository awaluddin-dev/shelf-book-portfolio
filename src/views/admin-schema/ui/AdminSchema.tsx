"use client";

import React from "react";
import { AdminProjectLinkedCards } from "@/widgets/admin-project-linked-cards/ui/AdminProjectLinkedCards";

export default function AdminSchema() {
  return (
    <AdminProjectLinkedCards
      title="Database Schema Nodes"
      apiEndpoint="/api/database-schema"
      itemDataExtractor={(data) => {
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
      }}
      defaultFormData={{ imageUrl: '', order: 0, description: '' }}
      onBeforeSave={(formData) => ({
        ...formData,
        order: Number(formData.order)
      })}
      renderForm={(formData, setFormData) => (
        <>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4">
              <input placeholder="Order (e.g. 0)" type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-20 px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
              <input placeholder="Image URL (e.g. /assets/schema1.png)" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
            </div>
            <textarea placeholder="Description (optional)" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none resize-y min-h-[60px]" />
          </div>
        </>
      )}
      renderCardDisplay={(item: any) => (
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-start w-full">
            <div className="w-8 h-8 rounded-full glass-card-inset flex items-center justify-center font-bold text-neu-accent shrink-0">
              {item.order}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-full aspect-video rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden flex items-center justify-center">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="Schema Preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-zinc-500 italic">No image URL provided</span>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 whitespace-pre-wrap">{item.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}
