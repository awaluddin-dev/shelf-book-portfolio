"use client";

import React from 'react';
import { AdminCrudTable } from '@/shared/ui/admin/AdminCrudTable';
import { Plus, X } from 'lucide-react';

export default function AdminProficiency() {
  return (
    <AdminCrudTable
      title="Proficiency Categories"
      itemName="Category"
      activePath="/admin/proficiency"
      apiEndpoint="/api/proficiency"
      dataExtractor={(data) => data.data?.proficiency || data.proficiency || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))}
      defaultFormData={{ title: '', skills: [] }}
      columns={[
        {
          header: 'Category Title',
          render: (item: any) => (
            <div className="font-bold text-neu-text uppercase">{item.title}</div>
          )
        },
        {
          header: 'Skills Count',
          render: (item: any) => (
            <div className="text-xs text-neu-text-muted">{item.skills?.length || 0} skills listed</div>
          )
        }
      ]}
      renderForm={(formData, setFormData) => {
        const handleAddSkill = () => {
          setFormData({
              ...formData,
              skills: [...(formData.skills || []), { id: 's_' + Date.now(), name: '', subtext: '', status: 'Production-ready' }]
          });
        };

        const handleUpdateSkill = (index: number, field: string, value: string) => {
          const newSkills = [...formData.skills];
          newSkills[index] = { ...newSkills[index], [field]: value };
          setFormData({ ...formData, skills: newSkills });
        };

        const handleRemoveSkill = (index: number) => {
          const newSkills = [...formData.skills];
          newSkills.splice(index, 1);
          setFormData({ ...formData, skills: newSkills });
        };

        return (
          <>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Category Title (e.g., CORE BACKEND)</label>
                <input required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none uppercase" placeholder="CORE BACKEND" />
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-neu-text-muted">Skills List</label>
                    <button type="button" onClick={handleAddSkill} className="text-xs font-bold text-neu-accent hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add Skill
                    </button>
                </div>
                
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 pb-2">
                    {(formData.skills || []).map((skill: any, index: number) => (
                        <div key={index} className="p-4 rounded-xl glass-card-inset border border-white/5 relative group">
                            <button type="button" onClick={() => handleRemoveSkill(index)} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                <X size={12} />
                            </button>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-neu-text-muted">Skill Name</label>
                                    <input required value={skill.name} onChange={e => handleUpdateSkill(index, 'name', e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50" placeholder="Node.js" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono text-neu-text-muted">Status</label>
                                    <select value={skill.status} onChange={e => handleUpdateSkill(index, 'status', e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50">
                                        <option value="Production-ready">Production-ready</option>
                                        <option value="In Use">In Use</option>
                                        <option value="Building">Building</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono text-neu-text-muted">Subtext (Experience / Context)</label>
                                <input required value={skill.subtext} onChange={e => handleUpdateSkill(index, 'subtext', e.target.value)} className="w-full px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-sm outline-none border border-transparent focus:border-neu-accent/50" placeholder="Production · 3+ yrs · ..." />
                            </div>
                        </div>
                    ))}
                    {(!formData.skills || formData.skills.length === 0) && (
                        <div className="text-center p-4 border border-dashed border-white/10 rounded-xl text-xs text-neu-text-muted">No skills added yet.</div>
                    )}
                </div>
            </div>
          </>
        );
      }}
    />
  );
}
