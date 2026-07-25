"use client";

import React from 'react';
import { AdminCrudTable } from '@/shared/ui/admin/AdminCrudTable';

export default function AdminLearning() {
  return (
    <AdminCrudTable
      title="Learning Roadmap"
      itemName="Tech Goal"
      activePath="/admin/learning"
      apiEndpoint="/api/learning"
      dataExtractor={(data) => data.data?.roadmap || data.roadmap || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))}
      defaultFormData={{ tech: '', quarter: '', status: 'Planned', icon: 'Terminal', description: '', depth: '', topics: '', projects: '' }}
      onBeforeSave={(formData) => ({
        ...formData,
        topics: typeof formData.topics === 'string' ? formData.topics.split(',').map((s: string) => s.trim()).filter(Boolean) : formData.topics,
        projects: typeof formData.projects === 'string' ? formData.projects.split(',').map((s: string) => s.trim()).filter(Boolean) : formData.projects
      })}
      columns={[
        {
          header: 'Technology',
          render: (item: any) => (
            <>
              <div className="font-bold text-neu-text">{item.tech}</div>
              <div className="text-xs text-neu-text-muted mt-1">{item.quarter}</div>
            </>
          )
        },
        {
          header: 'Status & Depth',
          render: (item: any) => (
            <>
              <div className="text-xs font-bold text-neu-accent">{item.status}</div>
              <div className="text-xs text-neu-text-muted">{item.depth}</div>
            </>
          )
        }
      ]}
      renderForm={(formData, setFormData) => (
        <>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                  <label className="text-xs font-mono text-neu-text-muted">Technology Name</label>
                  <input required value={formData.tech || ''} onChange={e => setFormData({...formData, tech: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Agentic AI" />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-mono text-neu-text-muted">Quarter / Target</label>
                  <input required value={formData.quarter || ''} onChange={e => setFormData({...formData, quarter: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Q3 2026" />
              </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                  <label className="text-xs font-mono text-neu-text-muted">Status</label>
                  <select value={formData.status || 'Planned'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none">
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                  </select>
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-mono text-neu-text-muted">Depth Target</label>
                  <input required value={formData.depth || ''} onChange={e => setFormData({...formData, depth: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Intermediate" />
              </div>
          </div>
          <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Icon (Lucide name)</label>
              <input required value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="BrainCircuit" />
          </div>
          <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Description</label>
              <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="Details about this goal..." />
          </div>
          <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Topics (comma separated)</label>
              <input required value={formData.topics || ''} onChange={e => setFormData({...formData, topics: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Stateful Agents, RAG" />
          </div>
          <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Projects (comma separated)</label>
              <input required value={formData.projects || ''} onChange={e => setFormData({...formData, projects: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="AuraFlow AI Backend" />
          </div>
        </>
      )}
    />
  );
}
