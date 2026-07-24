'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/shared/ui/admin/AdminSidebar';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Edit, Trash2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { cn } from '@/shared/lib/utils';

export default function AdminLearning() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsProcessing] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const router = useRouter();
  const { resolvedTheme: _resolvedTheme } = useTheme();
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    tech: '',
    quarter: '',
    status: 'Planned',
    icon: 'Terminal',
    description: '',
    depth: '',
    topics: '',
    projects: ''
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

  return (
    <div className="min-h-screen bg-neu-bg flex text-neu-text">
      {/* Sidebar */}
      <AdminSidebar activePath="/admin/learning" />

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
            <h1 className="text-2xl font-bold font-display tracking-tight">Upcoming Tech & Roadmap</h1>
            <div className="flex items-center gap-4">
                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-neu-accent text-white rounded-xl hover:bg-neu-accent/90 transition-colors font-bold text-sm shadow-neu-sm">
                  <Plus size={16} /> Add Tech
                </button>
            </div>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="glass-card-inset text-xs font-mono uppercase text-neu-text-muted">
                  <tr>
                    <th className="px-6 py-4 font-bold">Tech & Quarter</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-neu-text-muted font-mono">No roadmap items found.</td>
                    </tr>
                  ) : paginatedItems.map((w: any) => (
                    <tr key={w.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-neu-text">{w.tech}</div>
                        <div className="text-xs text-neu-text-muted">{w.quarter}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-neu-text text-xs">{w.status}</div>
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, items.length)} of {items.length} entries
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
            <h3 className="text-xl font-bold font-display mb-6">{editingItem ? 'Edit Tech' : 'Add Tech'}</h3>
            
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
