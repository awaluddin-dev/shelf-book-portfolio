"use client";

import React, { useState, useEffect } from 'react';
import { AdminCrudTable } from '@/widgets/admin-crud-table/ui/AdminCrudTable';

export default function AdminSkill() {
  const [proficiencies, setProficiencies] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/proficiency')
      .then(res => res.json())
      .then(data => {
        const list = data.data?.proficiencies || data.proficiencies || data.data || data || [];
        setProficiencies(list);
      })
      .catch(console.error);
  }, []);

  return (
    <AdminCrudTable
      title="Skill Tree Nodes"
      itemName="Skill Node"
      apiEndpoint="/api/skills"
      dataExtractor={(data) => {
        if (data.data?.skills) return data.data.skills;
        if (data.skills) return data.skills;
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
      }}
      defaultFormData={{ id: '', title: '', categoryId: '', proficiencySkillId: '', level: '', details: '', x: 0, y: 0, connections: '' }}
      onBeforeSave={(formData) => {
        // Strip relations out before save just in case, but pass IDs
        return {
          ...formData,
          id: formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          connections: typeof formData.connections === 'string' ? formData.connections.split(',').map((s: string) => s.trim()).filter(Boolean) : formData.connections
        };
      }}
      columns={[
        {
          header: 'Title & Category',
          render: (item: any) => (
            <>
              <div className="font-bold text-neu-text">{item.title}</div>
              <div className="text-xs text-neu-text-muted mt-1">{item.category}</div>
            </>
          )
        },
        {
          header: 'Position & Level',
          render: (item: any) => (
            <>
              <div className="text-xs font-bold text-neu-accent">{item.level}</div>
              <div className="text-xs text-neu-text-muted">x: {item.x}, y: {item.y}</div>
            </>
          )
        }
      ]}
      renderForm={(formData, setFormData) => (
        <>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Node ID (e.g., nodejs)</label>
                <input required value={formData.id || ''} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="nodejs" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-mono text-neu-text-muted">Title</label>
                    <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Node.js" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-mono text-neu-text-muted">Proficiency Category</label>
                    <select required value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value, proficiencySkillId: ''})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none appearance-none bg-black/40">
                      <option value="" disabled>Select Category</option>
                      {proficiencies.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-mono text-neu-text-muted">Specific Skill</label>
                    <select value={formData.proficiencySkillId || ''} onChange={e => setFormData({...formData, proficiencySkillId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none appearance-none bg-black/40">
                      <option value="">(None)</option>
                      {(proficiencies.find(p => p.id === formData.categoryId)?.skills || []).map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-mono text-neu-text-muted">Level</label>
                    <input required value={formData.level || ''} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Advanced" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-mono text-neu-text-muted">X Coord</label>
                    <input required type="number" value={formData.x || 0} onChange={e => setFormData({...formData, x: parseInt(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-mono text-neu-text-muted">Y Coord</label>
                    <input required type="number" value={formData.y || 0} onChange={e => setFormData({...formData, y: parseInt(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Details</label>
                <textarea required value={formData.details || ''} onChange={e => setFormData({...formData, details: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="3+ years experience in..." />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Connections (comma separated IDs)</label>
                <input value={formData.connections || ''} onChange={e => setFormData({...formData, connections: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="express, nestjs" />
            </div>
        </>
      )}
    />
  );
}
