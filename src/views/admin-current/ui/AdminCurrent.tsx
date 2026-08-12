"use client";

import React, { useState, useEffect } from 'react';
import { AdminCrudTable } from '@/widgets/admin-crud-table/ui/AdminCrudTable';

export default function AdminCurrent() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/learning')
      .then(res => res.json())
      .then(data => {
         let rm = [];
         if (data.data?.learning) rm = data.data.learning;
         else if (data.learning) rm = data.learning;
         else if (Array.isArray(data.data)) rm = data.data;
         else if (Array.isArray(data)) rm = data;
         setRoadmaps(rm);
      })
      .catch(err => console.error(err));
  }, []);
  return (
    <AdminCrudTable
      title="Right Now Focus"
      itemName="Focus Item"
      apiEndpoint="/api/current"
      dataExtractor={(data) => {
        if (data.data?.currentFocus) return data.data.currentFocus;
        if (data.currentFocus) return data.currentFocus;
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
      }}
      defaultFormData={{ title: '', icon: 'PenTool', description: '', link: '', linkText: '', roadmapId: '' }}
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
        },
        {
          header: 'Linked Roadmap',
          render: (item: any) => {
            const linked = roadmaps.find(r => r.id === item.roadmapId);
            return (
              <div className="text-xs text-neu-text-muted">
                {linked ? <span className="text-neu-accent">{linked.tech}</span> : 'Not Linked'}
              </div>
            );
          }
        }
      ]}
      renderForm={(formData, setFormData) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label htmlFor="ac-title" className="text-xs font-mono text-neu-text-muted">Title</label>
                <input id="ac-title" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Writing" />
            </div>
            <div className="space-y-1">
                <label htmlFor="ac-icon" className="text-xs font-mono text-neu-text-muted">Icon (Lucide name)</label>
                <input id="ac-icon" required value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="PenTool" />
            </div>
          </div>
          <div className="space-y-1">
              <label htmlFor="ac-desc" className="text-xs font-mono text-neu-text-muted">Description (1-2 sentences)</label>
              <textarea id="ac-desc" required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="What I'm doing right now..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                  <label htmlFor="ac-link" className="text-xs font-mono text-neu-text-muted">Link URL</label>
                  <input id="ac-link" required value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="https://..." />
              </div>
              <div className="space-y-1">
                  <label htmlFor="ac-linktext" className="text-xs font-mono text-neu-text-muted">Link Text</label>
                  <input id="ac-linktext" required value={formData.linkText || ''} onChange={e => setFormData({...formData, linkText: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Read on dev.to" />
              </div>
          </div>
          <div className="space-y-1">
              <label htmlFor="ac-roadmap" className="text-xs font-mono text-neu-text-muted">Linked Roadmap (Upcoming Tech)</label>
              <select id="ac-roadmap" value={formData.roadmapId || ''} onChange={e => setFormData({...formData, roadmapId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none">
                 <option value="">-- No Roadmap Linked --</option>
                 {roadmaps.map(rm => (
                   <option key={rm.id} value={rm.id}>{rm.tech} ({rm.quarter})</option>
                 ))}
              </select>
          </div>
        </>
      )}
    />
  );
}
