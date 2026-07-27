"use client";

import React from 'react';
import { AdminCrudTable } from '@/widgets/admin-crud-table/ui/AdminCrudTable';
import { Trash2 } from 'lucide-react';

export default function AdminProjects() {
  const defaultForm = {
    title: '', subtitle: '', category: '', tags: '', spineColor: '#4f46e5', coverColor: '#312e81',
    spineText: '', date: '', demoUrl: '', github: '', markdown: '', reasonToBuild: '', problemSolved: '',
    stats: [] as {label: string, value: string}[],
    phases: [] as {date: string, title: string, description: string}[]
  };

  return (
    <AdminCrudTable
      title="Portfolio Projects"
      itemName="Project"
      apiEndpoint="/api/projects"
      dataExtractor={(data) => {
        if (data.data?.projects) return data.data.projects;
        if (data.projects) return data.projects;
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data)) return data;
        return [];
      }}
      defaultFormData={defaultForm}
      onBeforeSave={(formData) => ({
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : formData.tags
      })}
      columns={[
        {
          header: 'Title',
          render: (item: any) => (
            <>
              <div className="font-bold">{item.title}</div>
              <div className="text-xs text-neu-text-muted truncate max-w-[250px]">{item.subtitle}</div>
            </>
          )
        },
        {
          header: 'Category',
          render: (item: any) => (
            <span className="px-2 py-1 rounded-md glass-card-inset text-xs font-mono text-neu-accent">{item.category}</span>
          )
        },
        {
          header: 'Date',
          render: (item: any) => (
            <span className="text-sm">{item.date}</span>
          )
        }
      ]}
      renderForm={(formData, setFormData) => {
        const addStat = () => setFormData({ ...formData, stats: [...formData.stats, {label: '', value: ''}] });
        const updateStat = (index: number, field: string, value: string) => {
          const newStats = [...formData.stats];
          newStats[index] = { ...newStats[index], [field]: value };
          setFormData({ ...formData, stats: newStats });
        };
        const removeStat = (index: number) => {
          const newStats = [...formData.stats];
          newStats.splice(index, 1);
          setFormData({ ...formData, stats: newStats });
        };

        const addPhase = () => setFormData({ ...formData, phases: [...formData.phases, {date: '', title: '', description: ''}] });
        const updatePhase = (index: number, field: string, value: string) => {
          const newPhases = [...formData.phases];
          newPhases[index] = { ...newPhases[index], [field]: value };
          setFormData({ ...formData, phases: newPhases });
        };
        const removePhase = (index: number) => {
          const newPhases = [...formData.phases];
          newPhases.splice(index, 1);
          setFormData({ ...formData, phases: newPhases });
        };

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Subtitle</label>
                <input required value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Category</label>
                <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Date</label>
                <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Problem Solved</label>
                <textarea required value={formData.problemSolved} onChange={e => setFormData({...formData, problemSolved: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Reason to Build</label>
                <textarea required value={formData.reasonToBuild} onChange={e => setFormData({...formData, reasonToBuild: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent resize-none" />
              </div>
              <div className="col-span-full space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Tags (comma separated)</label>
                <input required value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted uppercase">Spine Color</label>
                <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl glass-card-inset">
                  <input type="color" required value={formData.spineColor} onChange={e => setFormData({...formData, spineColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0" />
                  <span className="text-sm font-mono text-neu-text">{formData.spineColor}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted uppercase">Cover Color</label>
                <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl glass-card-inset">
                  <input type="color" required value={formData.coverColor} onChange={e => setFormData({...formData, coverColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0" />
                  <span className="text-sm font-mono text-neu-text">{formData.coverColor}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Spine Text</label>
                <input required value={formData.spineText} onChange={e => setFormData({...formData, spineText: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">GitHub URL</label>
                <input value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
              </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-neu-text-muted font-mono pl-1">Export your Excalidraw diagrams as SVG/PNG, place them in /public/assets/, then paste the paths here.</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Demo URL (Optional)</label>
                <input value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
              </div>
            </div>

            {/* Dynamic Stats */}
            <div className="p-4 border border-white/5 rounded-2xl space-y-4 bg-black/5 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Highlight Stats</h3>
                <button type="button" onClick={addStat} className="text-xs font-bold text-neu-accent">Add Stat</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.stats.map((stat: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <input placeholder="Label" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
                    <input placeholder="Value" value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
                    <button type="button" onClick={() => removeStat(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Phases */}
            <div className="p-4 border border-white/5 rounded-2xl space-y-4 bg-black/5 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Project Phases</h3>
                <button type="button" onClick={addPhase} className="text-xs font-bold text-neu-accent">Add Phase</button>
              </div>
              <div className="space-y-3">
                {formData.phases.map((phase: any, i: number) => (
                  <div key={i} className="flex flex-col gap-2 p-3 border border-white/10 rounded-xl relative">
                    <button type="button" onClick={() => removePhase(i)} className="absolute top-2 right-2 text-red-500"><Trash2 size={14}/></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input placeholder="Date" value={phase.date} onChange={e => updatePhase(i, 'date', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
                      <input placeholder="Title" value={phase.title} onChange={e => updatePhase(i, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
                    </div>
                    <textarea placeholder="Description" value={phase.description} onChange={e => updatePhase(i, 'description', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent min-h-[60px]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-neu-text-muted">Markdown Content</label>
              <textarea required value={formData.markdown} onChange={e => setFormData({...formData, markdown: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-mono outline-none focus:border-neu-accent border border-transparent min-h-[200px]" />
            </div>
          </div>
        );
      }}
    />
  );
}
