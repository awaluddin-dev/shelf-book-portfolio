'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { AdminPageLayout } from "@/shared/ui/admin/AdminPageLayout";
import { useAdminCrud } from "@/shared/hooks/useAdminCrud";

export default function AdminArchitecture() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  
  const {
    items, loading, toastMessage, editingItem: isEditing, setEditingItem: setIsEditing,
    handleSave, handleDelete
  } = useAdminCrud({
    apiUrl: '/api/architecture',
    onFetchSuccess: () => {
      fetch("/api/projects").then(res => res.json()).then(projData => {
        const projs = projData.data?.projects || projData.projects || (Array.isArray(projData.data) ? projData.data : []);
        setProjects(projs);
        if (projs.length > 0 && !selectedProjectId) setSelectedProjectId(projs[0].id);
      }).catch(() => {});
    }
  });

  const [formData, setFormData] = useState({ name: '', title: '', description: '', metrics: '', order: 0 });

  const filteredItems = items.filter(item => item.projectId === selectedProjectId).sort((a, b) => a.order - b.order);

  const onSave = (id?: string) => {
    const payload = { ...formData, order: Number(formData.order), projectId: selectedProjectId };
    handleSave(payload, id, id ? `/api/architecture/${id}` : '/api/architecture', id ? 'PATCH' : 'POST');
  };

  const formFields = (
    <>
      <div className="flex gap-4">
        <input placeholder="Node ID (e.g. gateway)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-1/3 px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
        <input placeholder="Order (e.g. 0)" type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-20 px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
      </div>
      <input placeholder="Title (e.g. NestJS Gateway)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
      <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none min-h-[100px]" />
      <input placeholder="KPI/Metrics (e.g. Response: <12ms)" value={formData.metrics} onChange={e => setFormData({...formData, metrics: e.target.value})} className="w-full px-3 py-2 rounded-lg glass-card-inset text-sm outline-none" />
    </>
  );

  return (
    <AdminPageLayout
      activePath="/admin/architecture"
      title="System Architecture Nodes"
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
                <div className="flex gap-2">
                  <button onClick={() => {setIsEditing(item); setFormData({name: item.name, title: item.title, description: item.description, metrics: item.metrics, order: item.order});}} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-neu-accent"><Edit2 size={16}/></button>
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
          <button onClick={() => {setIsEditing({ id: 'new' }); setFormData({name: '', title: '', description: '', metrics: '', order: filteredItems.length});}} className="p-6 rounded-2xl glass-card-inset border-2 border-dashed border-gray-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-3 text-neu-text-muted hover:text-neu-accent hover:border-neu-accent transition-colors cursor-pointer min-h-[200px]">
            <Plus size={24} />
            <span className="font-bold text-sm">Add Architecture Node</span>
          </button>
        )}
      </div>
    </AdminPageLayout>
  );
}
