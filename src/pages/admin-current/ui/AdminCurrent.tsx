"use client";

import React from 'react';
import { AdminCrudTable } from '@/widgets/admin-crud-table/ui/AdminCrudTable';

export default function AdminCurrent() {
  return (
    <AdminCrudTable
      title="Right Now Focus"
      itemName="Focus Item"
      activePath="/admin/current"
      apiEndpoint="/api/current"
      dataExtractor={(data) => {
        if (data.data?.currentFocus) return data.data.currentFocus;
        if (data.currentFocus) return data.currentFocus;
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
      }}
      defaultFormData={{ title: '', icon: 'PenTool', description: '', link: '', linkText: '' }}
      columns={[
        {
          header: 'Focus Area',
          render: (item: any) => (
            <>
              <div className="font-bold text-neu-text">{item.title}</div>
              <div className="text-xs text-neu-text-muted mt-1">{item.description}</div>
            </>
          )
        },
        {
          header: 'Call to Action',
          render: (item: any) => (
            <>
              <div className="text-xs font-bold text-neu-accent">{item.linkText}</div>
              <div className="text-xs text-neu-text-muted">{item.link}</div>
            </>
          )
        }
      ]}
      renderForm={(formData, setFormData) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Title</label>
                <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Writing" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Icon (Lucide name)</label>
                <input required value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="PenTool" />
            </div>
          </div>
          <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Description (1-2 sentences)</label>
              <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="What I'm doing right now..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                  <label className="text-xs font-mono text-neu-text-muted">Link URL</label>
                  <input required value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="https://..." />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-mono text-neu-text-muted">Link Text</label>
                  <input required value={formData.linkText || ''} onChange={e => setFormData({...formData, linkText: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Read on dev.to" />
              </div>
          </div>
        </>
      )}
    />
  );
}
