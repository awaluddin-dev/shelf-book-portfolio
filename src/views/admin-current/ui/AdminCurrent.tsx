'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { AdminTable, AdminTableActions } from '@/shared/ui/admin/AdminTable';

export default function AdminCurrent() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '', icon: 'PenTool', description: '', link: '', linkText: ''
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/current');
      const data = await res.json();
      setItems(data.data?.current || data.current || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])));
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
      const url = editingItem ? `/api/current/${editingItem.id}` : '/api/current';
      const method = editingItem ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      setToastMessage({ message: `Successfully ${editingItem ? 'updated' : 'added'} current focus`, type: 'success' });
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch {
      setToastMessage({ message: 'Failed to save item', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`/api/current/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (!res.ok) throw new Error('Failed to delete');
      
      setToastMessage({ message: 'Successfully deleted item', type: 'success' });
      fetchData();
    } catch {
      setToastMessage({ message: 'Failed to delete item', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: '', icon: 'PenTool', description: '', link: '', linkText: '' });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      icon: item.icon || 'PenTool',
      description: item.description || '',
      link: item.link || '',
      linkText: item.linkText || ''
    });
    setShowModal(true);
  };

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Writing" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Icon (Lucide name)</label>
                <input required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="PenTool" />
            </div>
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Description (1-2 sentences)</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="What I'm doing right now..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Link URL</label>
                <input required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="https://..." />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Link Text</label>
                <input required value={formData.linkText} onChange={e => setFormData({...formData, linkText: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="Read on dev.to" />
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
      onAdd={openAddModal}
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
            <AdminTableActions onEdit={() => openEditModal(w)} onDelete={() => handleDelete(w.id)} />
          </>
        )}
      />
    </AdminPageLayout>
  );
}
