'use client';

import { useState } from 'react';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { AdminTable, AdminTableActions } from '@/shared/ui/admin/AdminTable';
import { useAdminCrud } from '@/shared/hooks/useAdminCrud';

export default function AdminLearning() {
  const {
    items, loading, toastMessage, showModal, setShowModal, editingItem,
    handleSave, handleDelete, openAddModal, openEditModal
  } = useAdminCrud({ 
    apiUrl: '/api/learning', 
    dataKey: 'roadmap',
    formatPayload: (formData) => ({
      ...formData,
      topics: formData.topics.split(',').map((s: string) => s.trim()).filter(Boolean),
      projects: formData.projects.split(',').map((s: string) => s.trim()).filter(Boolean)
    })
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    tech: '', quarter: '', status: 'Planned', icon: 'Terminal', description: '', depth: '', topics: '', projects: ''
  });

  const onAdd = () => openAddModal({ tech: '', quarter: '', status: 'Planned', icon: 'Terminal', description: '', depth: '', topics: '', projects: '' }, setFormData);
  
  const onEdit = (item: any) => openEditModal(item, (data) => setFormData({
    tech: data.tech || '',
    quarter: data.quarter || '',
    status: data.status || 'Planned',
    icon: data.icon || 'Terminal',
    description: data.description || '',
    depth: data.depth || '',
    topics: (data.data?.topics || data.topics || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))).join(', '),
    projects: (data.data?.projects || data.projects || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))).join(', ')
  }));

  const formContent = (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Technology Name</label>
                <input required value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Agentic AI" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Quarter / Target</label>
                <input required value={formData.quarter} onChange={e => setFormData({...formData, quarter: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Q3 2026" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none">
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Depth Target</label>
                <input required value={formData.depth} onChange={e => setFormData({...formData, depth: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Intermediate" />
            </div>
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Icon (Lucide name)</label>
            <input required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="BrainCircuit" />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="Details about this goal..." />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Topics (comma separated)</label>
            <input required value={formData.topics} onChange={e => setFormData({...formData, topics: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Stateful Agents, RAG" />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Projects (comma separated)</label>
            <input required value={formData.projects} onChange={e => setFormData({...formData, projects: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="AuraFlow AI Backend" />
        </div>
        
        <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-neu-accent shadow-neu hover:shadow-neu-sm active:scale-95 transition-all text-sm mt-4">
            {editingItem ? 'Save Changes' : 'Create Tech Goal'}
        </button>
    </form>
  );

  return (
    <AdminPageLayout
      activePath="/admin/learning"
      title="Upcoming Tech & Roadmap"
      loading={loading}
      onAdd={onAdd}
      addButtonLabel="Add Tech"
      toastMessage={toastMessage}
      showModal={showModal}
      onCloseModal={() => setShowModal(false)}
      modalTitle={editingItem ? 'Edit Tech' : 'Add Tech'}
      modalContent={formContent}
    >
      <AdminTable
        headers={['Tech & Quarter', 'Status', 'Actions']}
        items={items}
        currentPage={currentPage}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
        emptyMessage="No roadmap items found."
        renderRow={(w: any) => (
          <>
            <td className="px-6 py-4">
              <div className="font-bold text-neu-text">{w.tech}</div>
              <div className="text-xs text-neu-text-muted">{w.quarter}</div>
            </td>
            <td className="px-6 py-4">
              <div className="font-bold text-neu-text text-xs">{w.status}</div>
            </td>
            <AdminTableActions onEdit={() => onEdit(w)} onDelete={() => handleDelete(w.id)} />
          </>
        )}
      />
    </AdminPageLayout>
  );
}
