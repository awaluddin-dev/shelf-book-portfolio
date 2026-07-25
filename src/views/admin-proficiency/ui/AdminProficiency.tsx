'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { AdminTable, AdminTableActions } from '@/shared/ui/admin/AdminTable';
import { Plus, X } from 'lucide-react';

export default function AdminProficiency() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    skills: [] as { id: string, name: string, subtext: string, status: string }[]
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/proficiency');
      const data = await res.json();
      setCategories(data.data?.proficiency || data.proficiency || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])));
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/admin/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    setIsProcessing(true);
    e.preventDefault();
    try {
      const url = editingItem ? `/api/proficiency/${editingItem.id}` : '/api/proficiency';
      const method = editingItem ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      setToastMessage({ message: `Successfully ${editingItem ? 'updated' : 'added'} category`, type: 'success' });
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch {
      setToastMessage({ message: 'Failed to save category', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const res = await fetch(`/api/proficiency/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (!res.ok) throw new Error('Failed to delete');
      
      setToastMessage({ message: 'Successfully deleted category', type: 'success' });
      fetchData();
    } catch {
      setToastMessage({ message: 'Failed to delete category', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: '', skills: [] });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      skills: item.skills ? JSON.parse(JSON.stringify(item.skills)) : []
    });
    setShowModal(true);
  };

  const handleAddSkill = () => {
    setFormData({
        ...formData,
        skills: [...formData.skills, { id: 's_' + Date.now(), name: '', subtext: '', status: 'Production-ready' }]
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

  const formContent = (
    <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Category Title (e.g., CORE BACKEND)</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none uppercase" placeholder="CORE BACKEND" />
        </div>
        
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-neu-text-muted">Skills List</label>
                <button type="button" onClick={handleAddSkill} className="text-xs font-bold text-neu-accent hover:underline flex items-center gap-1">
                    <Plus size={14} /> Add Skill
                </button>
            </div>
            
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 pb-2">
                {formData.skills.map((skill, index) => (
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
                {formData.skills.length === 0 && (
                    <div className="text-center p-4 border border-dashed border-white/10 rounded-xl text-xs text-neu-text-muted">No skills added yet.</div>
                )}
            </div>
        </div>
        
        <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-neu-accent shadow-neu hover:shadow-neu-sm active:scale-95 transition-all text-sm mt-4">
            {editingItem ? 'Save Category' : 'Create Category'}
        </button>
    </form>
  );

  return (
    <AdminPageLayout
      activePath="/admin/proficiency"
      title="Technical Proficiency"
      loading={loading}
      onAdd={openAddModal}
      addButtonLabel="Add Category"
      toastMessage={toastMessage}
      showModal={showModal}
      onCloseModal={() => setShowModal(false)}
      modalTitle={editingItem ? 'Edit Category' : 'Add Category'}
      modalContent={formContent}
    >
      <AdminTable
        headers={['Category Title', 'Skills Count', 'Actions']}
        items={categories}
        currentPage={currentPage}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
        emptyMessage="No categories found."
        renderRow={(w: any) => (
          <>
            <td className="px-6 py-4">
              <div className="font-bold text-neu-text uppercase">{w.title}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-xs text-neu-text-muted">{w.skills?.length || 0} skills listed</div>
            </td>
            <AdminTableActions onEdit={() => openEditModal(w)} onDelete={() => handleDelete(w.id)} />
          </>
        )}
      />
    </AdminPageLayout>
  );
}
