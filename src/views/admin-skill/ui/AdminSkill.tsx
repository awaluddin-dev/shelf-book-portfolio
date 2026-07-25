'use client';

import { useState } from 'react';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { AdminTable, AdminTableActions } from '@/shared/ui/admin/AdminTable';
import { useAdminCrud } from '@/shared/hooks/useAdminCrud';

export default function AdminSkill() {
  const {
    items: skills, loading, toastMessage, showModal, setShowModal, editingItem,
    handleSave, handleDelete, openAddModal, openEditModal
  } = useAdminCrud({
    apiUrl: '/api/skills',
    dataKey: 'skills',
    formatPayload: (formData) => ({
      ...formData,
      id: formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      connections: formData.connections.split(',').map((s: string) => s.trim()).filter(Boolean)
    })
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    id: '', title: '', category: '', level: '', details: '', x: 0, y: 0, connections: ''
  });

  const onAdd = () => openAddModal({ id: '', title: '', category: 'Core Backend', level: '', details: '', x: 0, y: 0, connections: '' }, setFormData);
  const onEdit = (item: any) => openEditModal(item, (data) => setFormData({
    id: data.id || '',
    title: data.title || '',
    category: data.category || '',
    level: data.level || '',
    details: data.details || '',
    x: data.x || 0,
    y: data.y || 0,
    connections: (data.data?.connections || data.connections || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))).join(', ')
  }));

  const formContent = (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">ID (lowercase, no spaces)</label>
                <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="nodejs" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Display Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Node.js" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Category</label>
                <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Core Backend" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Level / Subtext</label>
                <input required value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Production · 3+ yrs" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">X Coordinate</label>
                <input required type="number" value={formData.x} onChange={e => setFormData({...formData, x: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="80" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Y Coordinate</label>
                <input required type="number" value={formData.y} onChange={e => setFormData({...formData, y: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="80" />
            </div>
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Connections (comma separated IDs)</label>
            <input value={formData.connections} onChange={e => setFormData({...formData, connections: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="typescript, nestjs" />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Detailed Description</label>
            <textarea required value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="Details about this skill..." />
        </div>
        
        <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-neu-accent shadow-neu hover:shadow-neu-sm active:scale-95 transition-all text-sm mt-4">
            {editingItem ? 'Save Changes' : 'Create Node'}
        </button>
    </form>
  );

  return (
    <AdminPageLayout
      activePath="/admin/skill"
      title="Interactive Skill Tree"
      loading={loading}
      onAdd={onAdd}
      addButtonLabel="Add Node"
      toastMessage={toastMessage}
      showModal={showModal}
      onCloseModal={() => setShowModal(false)}
      modalTitle={editingItem ? 'Edit Node' : 'Add Node'}
      modalContent={formContent}
    >
      <AdminTable
        headers={['Node (ID)', 'Category & Level', 'Coords (X, Y)', 'Actions']}
        items={skills}
        currentPage={currentPage}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
        emptyMessage="No nodes found."
        renderRow={(w: any) => (
          <>
            <td className="px-6 py-4">
              <div className="font-bold text-neu-text">{w.title}</div>
              <div className="text-xs text-neu-text-muted font-mono">#{w.id}</div>
            </td>
            <td className="px-6 py-4">
              <div className="font-bold text-neu-text text-xs">{w.category}</div>
              <div className="text-xs text-neu-text-muted">{w.level}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-xs text-neu-text-muted font-mono">X: {w.x} | Y: {w.y}</div>
            </td>
            <AdminTableActions onEdit={() => onEdit(w)} onDelete={() => handleDelete(w.id)} />
          </>
        )}
      />
    </AdminPageLayout>
  );
}
