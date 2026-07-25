'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, ExternalLink } from "lucide-react";
import { AdminPageLayout } from "@/shared/ui/admin/AdminPageLayout";
import { useAdminCrud } from "@/shared/hooks/useAdminCrud";

export default function AdminLifecycle() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  
  const {
    items, loading, toastMessage, editingItem: isEditing, setEditingItem: setIsEditing,
    handleSave, handleDelete
  } = useAdminCrud({
    apiUrl: '/api/lifecycle',
    onFetchSuccess: () => {
      // Fetch projects in parallel when lifecycle fetches
      fetch("/api/projects").then(res => res.json()).then(projData => {
        const projs = projData.data?.projects || projData.projects || (Array.isArray(projData.data) ? projData.data : []);
        setProjects(projs);
        if (projs.length > 0 && !selectedProjectId) setSelectedProjectId(projs[0].id);
      }).catch(() => {});
    }
  });

  const [formData, setFormData] = useState({ stage: '', date: '', title: '', description: '', evidentUrl: '', order: 0 });

  const filteredItems = items
    .filter(item => item.projectId === selectedProjectId)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const onSave = (id?: string) => {
    const payload = { 
      ...formData, 
      order: Number(formData.order),
      projectId: selectedProjectId 
    };
    if (!payload.evidentUrl) {
      delete (payload as any).evidentUrl;
    }
    handleSave(payload, id, id ? `/api/lifecycle/${id}` : '/api/lifecycle', id ? 'PATCH' : 'POST');
  };

  const formFields = (
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
  );

  return (
    <AdminPageLayout
      activePath="/admin/lifecycle"
      title="Project Lifecycle Tracker"
      loading={loading}
      toastMessage={toastMessage}
    >
      <div className="mb-8">
        <label className="text-sm font-bold text-neu-text-muted mb-2 block">Select Project</label>
        <select 
          value={selectedProjectId} 
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-xl glass-card-inset text-sm font-bold outline-none focus:border-neu-accent"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="p-6 rounded-2xl glass-card flex flex-col gap-4">
            {isEditing?.id === item.id ? (
              <div className="space-y-4">
                {formFields}
                <div className="flex gap-2">
                  <button onClick={() => onSave(item.id)} className="px-4 py-2 rounded-lg bg-neu-accent text-white font-bold text-sm flex items-center gap-2"><Save size={14}/> Save</button>
                  <button onClick={() => setIsEditing(null)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 text-neu-text font-bold text-sm"><X size={14}/></button>
                </div>
              </div>
            ) : (
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
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => {
                    setIsEditing(item); 
                    setFormData({
                      stage: item.stage || 'Planning & Spec', 
                      date: item.date, 
                      title: item.title, 
                      description: item.description, 
                      evidentUrl: item.evidentUrl || '',
                      order: item.order || 0
                    });
                  }} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-neu-accent"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"><Trash2 size={16}/></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isEditing?.id === 'new' ? (
          <div className="p-6 rounded-2xl glass-card border border-neu-accent space-y-4">
            {formFields}
            <div className="flex gap-2">
              <button onClick={() => onSave()} className="px-4 py-2 rounded-lg bg-neu-accent text-white font-bold text-sm flex items-center gap-2"><Save size={14}/> Save</button>
              <button onClick={() => setIsEditing(null)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 text-neu-text font-bold text-sm"><X size={14}/></button>
            </div>
          </div>
        ) : (
          <button onClick={() => {
            setIsEditing({ id: 'new' }); 
            setFormData({
              stage: 'Planning & Spec', 
              date: '', 
              title: '', 
              description: '', 
              evidentUrl: '',
              order: filteredItems.length
            });
          }} className="p-6 rounded-2xl glass-card-inset border-2 border-dashed border-gray-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-3 text-neu-text-muted hover:text-neu-accent hover:border-neu-accent transition-colors cursor-pointer min-h-[200px]">
            <Plus size={24} />
            <span className="font-bold text-sm">Add Lifecycle Phase</span>
          </button>
        )}
      </div>
    </AdminPageLayout>
  );
}
