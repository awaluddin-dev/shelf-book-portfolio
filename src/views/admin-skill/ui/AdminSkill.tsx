'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/shared/ui/admin/AdminSidebar';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Edit, Trash2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { cn } from '@/shared/lib/utils';

export default function AdminSkill() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsProcessing] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(skills.length / itemsPerPage);
  const paginatedItems = skills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const router = useRouter();
  const { resolvedTheme: _resolvedTheme } = useTheme();
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: '',
    level: '',
    details: '',
    x: 0,
    y: 0,
    connections: ''
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

  return (
    <div className="min-h-screen bg-neu-bg flex text-neu-text">
      {/* Sidebar */}
      <AdminSidebar activePath="/admin/skill" />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <div className="max-w-5xl mx-auto space-y-6 p-6 w-full animate-pulse">
            <div className="h-10 bg-white/5 rounded-xl w-1/4"></div>
            <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
            <div className="h-64 bg-white/5 rounded-3xl w-full"></div>
            <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-display tracking-tight">Interactive Skill Tree</h1>
            <div className="flex items-center gap-4">
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-neu-accent text-white rounded-xl hover:bg-neu-accent/90 transition-colors font-bold text-sm shadow-neu-sm">
                  <Plus size={16} /> Add Node
                </button>
            </div>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="glass-card-inset text-xs font-mono uppercase text-neu-text-muted">
                  <tr>
                    <th className="px-6 py-4 font-bold">Node (ID)</th>
                    <th className="px-6 py-4 font-bold">Category & Level</th>
                    <th className="px-6 py-4 font-bold">Coords (X, Y)</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {skills.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-neu-text-muted font-mono">No nodes found.</td>
                    </tr>
                  ) : paginatedItems.map((w: any) => (
                    <tr key={w.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
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
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <button onClick={() => openEditModal(w)} className="p-2 rounded-xl glass-card text-neu-accent hover:scale-105 active:scale-95 transition-all" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(w.id)} className="p-2 rounded-xl glass-card text-red-500 hover:scale-105 active:scale-95 transition-all" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-neu-text-muted font-mono">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, skills.length)} of {skills.length} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 rounded-xl glass-card text-neu-text hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-sm font-bold font-mono px-2">
                  {currentPage} / {totalPages}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl glass-card text-neu-text hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          </div>
        </div>
      )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neu-bg rounded-3xl shadow-neu-modal w-full max-w-lg p-8 relative border border-white/5 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neu-text transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold font-display mb-6">{editingItem ? 'Edit Node' : 'Add Node'}</h3>
            
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
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }} className={cn("fixed bottom-8 left-1/2 z-[200] px-6 py-3.5 rounded-2xl font-mono text-xs shadow-neu border backdrop-blur-md flex items-center gap-2.5", toastMessage.type === 'success' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20")}>
            {toastMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            <span>{toastMessage.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
