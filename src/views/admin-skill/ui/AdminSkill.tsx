'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { AdminTable, AdminTableActions } from '@/shared/ui/admin/AdminTable';

export default function AdminSkill() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    id: '', title: '', category: '', level: '', details: '', x: 0, y: 0, connections: ''
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data.data?.skills || data.skills || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])));
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
      const url = editingItem ? `/api/skills/${editingItem.id}` : '/api/skills';
      const method = editingItem ? 'PATCH' : 'POST';
      
      const payload = {
        ...formData,
        id: formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        connections: formData.connections.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      setToastMessage({ message: `Successfully ${editingItem ? 'updated' : 'added'} skill node`, type: 'success' });
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch {
      setToastMessage({ message: 'Failed to save skill node', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    if (!confirm('Are you sure you want to delete this node?')) return;
    
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (!res.ok) throw new Error('Failed to delete');
      
      setToastMessage({ message: 'Successfully deleted skill node', type: 'success' });
      fetchData();
    } catch {
      setToastMessage({ message: 'Failed to delete skill node', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ id: '', title: '', category: 'Core Backend', level: '', details: '', x: 0, y: 0, connections: '' });
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      id: item.id || '',
      title: item.title || '',
      category: item.category || '',
      level: item.level || '',
      details: item.details || '',
      x: item.x || 0,
      y: item.y || 0,
      connections: (item.data?.connections || item.connections || (Array.isArray(item.data) ? item.data : (Array.isArray(item) ? item : []))).join(', ')
    });
    setShowModal(true);
  };

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4">
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
      onAdd={openAddModal}
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
            <AdminTableActions onEdit={() => openEditModal(w)} onDelete={() => handleDelete(w.id)} />
          </>
        )}
      />
    </AdminPageLayout>
  );
}
