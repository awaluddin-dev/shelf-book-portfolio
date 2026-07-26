import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AdminPageSkeleton } from './AdminPageSkeleton';

interface AdminProjectLinkedCardsProps<T> {
  title: string;
  activePath: string;
  apiEndpoint: string;
  itemDataExtractor: (data: any) => T[];
  defaultFormData: any;
  renderForm: (formData: any, setFormData: React.Dispatch<React.SetStateAction<any>>, isEditing: boolean) => React.ReactNode;
  renderCardDisplay: (item: T) => React.ReactNode;
  onBeforeSave?: (formData: any) => any;
}

export function AdminProjectLinkedCards<T extends { id?: string, projectId?: string, order?: number }>({
  title,
  activePath,
  apiEndpoint,
  itemDataExtractor,
  defaultFormData,
  renderForm,
  renderCardDisplay,
  onBeforeSave
}: AdminProjectLinkedCardsProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(defaultFormData);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then(res => res.json()),
      fetch(apiEndpoint).then(res => res.json())
    ]).then(([projData, itemData]) => {
      const projs = projData.data?.projects || projData.projects || (Array.isArray(projData.data) ? projData.data : []);
      const extractedItems = itemDataExtractor(itemData);
      setProjects(projs);
      setItems(Array.isArray(extractedItems) ? extractedItems : []);
      if (projs.length > 0) setSelectedProjectId(projs[0].id);
      setLoading(false);
    });
  }, [apiEndpoint, itemDataExtractor]);

  const filteredItems = items
    .filter(item => item.projectId === selectedProjectId)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleSave = async (id?: string) => {
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `${apiEndpoint}/${id}` : apiEndpoint;
    
    let payload = { 
      ...formData, 
      projectId: selectedProjectId 
    };
    
    if (onBeforeSave) {
      payload = onBeforeSave(payload);
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const updated = await fetch(apiEndpoint).then(r => r.json());
      setItems(itemDataExtractor(updated));
      setIsEditing(null);
      setFormData(defaultFormData);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const res = await fetch(`${apiEndpoint}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (res.ok) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-neu-bg flex">
      <AdminSidebar activePath={activePath} />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-display font-bold text-neu-text mb-8">{title}</h1>
        
        {loading ? (
          <AdminPageSkeleton />
        ) : (
          <>
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
                  {isEditing === item.id ? (
                    <div className="space-y-4">
                      {renderForm(formData, setFormData, true)}
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(item.id)} className="px-4 py-2 rounded-lg bg-neu-accent text-white font-bold text-sm flex items-center gap-2"><Save size={14}/> Save</button>
                        <button onClick={() => setIsEditing(null)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 text-neu-text font-bold text-sm"><X size={14}/></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {renderCardDisplay(item)}
                      <div className="flex gap-2 mt-2 pt-4 border-t border-white/5">
                        <button 
                          onClick={() => {
                            setIsEditing(item.id!);
                            setFormData(item);
                          }} 
                          className="p-2 rounded-lg glass-card text-neu-accent hover:scale-105 transition-transform"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id!)} 
                          className="p-2 rounded-lg glass-card text-red-500 hover:scale-105 transition-transform"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {/* Add New Section */}
              {isEditing === 'new' ? (
                <div className="p-6 rounded-2xl glass-card border border-neu-accent/50">
                  <h3 className="font-bold mb-4">Add New Item</h3>
                  <div className="space-y-4">
                    {renderForm(formData, setFormData, false)}
                    <div className="flex gap-2">
                      <button onClick={() => handleSave()} className="px-4 py-2 rounded-lg bg-neu-accent text-white font-bold text-sm flex items-center gap-2"><Save size={14}/> Save</button>
                      <button onClick={() => setIsEditing(null)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 text-neu-text font-bold text-sm"><X size={14}/></button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setFormData(defaultFormData);
                    setIsEditing('new');
                  }} 
                  className="p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-neu-accent/50 text-neu-text-muted hover:text-neu-accent flex items-center justify-center gap-2 transition-colors font-bold"
                >
                  <Plus size={20} /> Add New Item
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
