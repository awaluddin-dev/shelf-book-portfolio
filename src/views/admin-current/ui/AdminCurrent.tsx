'use client';

import { useState } from 'react';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { AdminTable, AdminTableActions } from '@/shared/ui/admin/AdminTable';
import { useAdminCrud } from '@/shared/hooks/useAdminCrud';

export default function AdminCurrent() {
  const {
    items, loading, toastMessage, showModal, setShowModal, editingItem,
    handleSave, handleDelete, openAddModal, openEditModal
  } = useAdminCrud({ apiUrl: '/api/current', dataKey: 'current' });

  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '', icon: 'PenTool', description: '', link: '', linkText: ''
  });

  const onAdd = () => openAddModal({ title: '', icon: 'PenTool', description: '', link: '', linkText: '' }, setFormData);
  const onEdit = (item: any) => openEditModal(item, (data) => setFormData({
    title: data.title || '', icon: data.icon || 'PenTool', description: data.description || '', link: data.link || '', linkText: data.linkText || ''
  }));

  const formContent = (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-admincurrent-1">Title</label>
                <input id="field-admincurrent-1" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Writing" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-admincurrent-2">Icon (Lucide name)</label>
                <input id="field-admincurrent-2" required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="PenTool" />
            </div>
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-admincurrent-3">Description (1-2 sentences)</label>
            <textarea id="field-admincurrent-3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="What I'm doing right now..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-admincurrent-4">Link URL</label>
                <input id="field-admincurrent-4" required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="https://..." />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-admincurrent-5">Link Text</label>
                <input id="field-admincurrent-5" required value={formData.linkText} onChange={e => setFormData({...formData, linkText: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Read on dev.to" />
            </div>
        </div>
        
        <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-neu-accent shadow-neu hover:shadow-neu-sm active:scale-95 transition-all text-sm mt-4">
            {editingItem ? 'Save Changes' : 'Create Focus Item'}
        </button>
    </form>
  );

  return (
    <AdminPageLayout
      activePath="/admin/current"
      title="Right Now Focus"
      loading={loading}
      onAdd={onAdd}
      addButtonLabel="Add Focus"
      toastMessage={toastMessage}
      showModal={showModal}
      onCloseModal={() => setShowModal(false)}
      modalTitle={editingItem ? 'Edit Focus' : 'Add Focus'}
      modalContent={formContent}
    >
      <AdminTable
        headers={['Focus Area', 'Call to Action', 'Actions']}
        items={items}
        currentPage={currentPage}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
        emptyMessage="No focus items found."
        renderRow={(w: any) => (
          <>
            <td className="px-6 py-4">
              <div className="font-bold text-neu-text">{w.title}</div>
              <div className="text-xs text-neu-text-muted mt-1">{w.description}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-xs font-bold text-neu-accent">{w.linkText}</div>
              <div className="text-xs text-neu-text-muted">{w.link}</div>
            </td>
            <AdminTableActions onEdit={() => onEdit(w)} onDelete={() => handleDelete(w.id)} />
          </>
        )}
      />
    </AdminPageLayout>
  );
}
