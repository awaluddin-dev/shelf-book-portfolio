'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { AdminTable, AdminTableActions } from '@/shared/ui/admin/AdminTable';

export default function AdminLearning() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    tech: '', quarter: '', status: 'Planned', icon: 'Terminal', description: '', depth: '', topics: '', projects: ''
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/learning');
      const data = await res.json();
      setItems(data.data?.roadmap || data.roadmap || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])));
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
      const url = editingItem ? `/api/learning/${editingItem.id}` : '/api/learning';
      const method = editingItem ? 'PATCH' : 'POST';
      
      const payload = {
        ...formData,
        topics: formData.topics.split(',').map(s => s.trim()).filter(Boolean),
        projects: formData.projects.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      setToastMessage({ message: `Successfully ${editingItem ? 'updated' : 'added'} roadmap item`, type: 'success' });
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch {
      setToastMessage({ message: 'Failed to save roadmap item', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`/api/learning/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
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
    setFormData({ tech: '', quarter: '', status: 'Planned', icon: 'Terminal', description: '', depth: '', topics: '', projects: '' });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      tech: item.tech || '',
      quarter: item.quarter || '',
      status: item.status || 'Planned',
      icon: item.icon || 'Terminal',
      description: item.description || '',
      depth: item.depth || '',
      topics: (item.data?.topics || item.topics || (Array.isArray(item.data) ? item.data : (Array.isArray(item) ? item : []))).join(', '),
      projects: (item.data?.projects || item.projects || (Array.isArray(item.data) ? item.data : (Array.isArray(item) ? item : []))).join(', ')
    });
    setShowModal(true);
  };

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
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
      onAdd={openAddModal}
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
            <AdminTableActions onEdit={() => openEditModal(w)} onDelete={() => handleDelete(w.id)} />
          </>
        )}
      />
    </AdminPageLayout>
  );
}
