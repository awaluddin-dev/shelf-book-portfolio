"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/shared/lib/utils';
import { AdminPageSkeleton } from '@/widgets/admin-page-skeleton/ui/AdminPageSkeleton';

export interface AdminCrudTableProps<T = any> {
  title: string;
  itemName: string;
  apiEndpoint: string;
  dataExtractor?: (data: any) => T[];
  columns: {
    header: string;
    render: (item: T) => React.ReactNode;
  }[];
  renderForm: (formData: any, setFormData: React.Dispatch<React.SetStateAction<any>>, isEditing: boolean) => React.ReactNode;
  defaultFormData: any;
  itemsPerPage?: number;
  onBeforeSave?: (formData: any) => any;
  customActions?: (item: T) => React.ReactNode;
}

export function AdminCrudTable<T extends { id?: string }>({
  title,
  itemName,
  apiEndpoint,
  dataExtractor,
  columns,
  renderForm,
  defaultFormData,
  itemsPerPage = 5,
  onBeforeSave,
  customActions
}: AdminCrudTableProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<any>(defaultFormData);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchData = async () => {
    try {
      const res = await fetch(apiEndpoint);
      const data = await res.json();
      if (dataExtractor) {
        setItems(dataExtractor(data));
      } else {
        setItems(data.data || (Array.isArray(data) ? data : []));
      }
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/admin/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const url = editingItem ? `${apiEndpoint}/${editingItem.id}` : apiEndpoint;
      const method = editingItem ? 'PATCH' : 'POST';
      
      const payload = onBeforeSave ? onBeforeSave(formData) : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      setToastMessage({ message: `Successfully ${editingItem ? 'updated' : 'added'} ${itemName}`, type: 'success' });
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch (err) {
      setToastMessage({ message: `Failed to save ${itemName}`, type: 'error' });
      console.error(err);
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    setIsProcessing(true);
    if (!confirm('Are you sure you want to delete this item?')) {
      setIsProcessing(false);
      return;
    }
    
    try {
      const res = await fetch(`${apiEndpoint}/${id}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
      });
      if (!res.ok) throw new Error('Failed to delete');
      
      setToastMessage({ message: `Successfully deleted ${itemName}`, type: 'success' });
      fetchData();
    } catch (err) {
      setToastMessage({ message: `Failed to delete ${itemName}`, type: 'error' });
      console.error(err);
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setShowModal(true);
  };

  const openEditModal = (item: T) => {
    setEditingItem(item);
    // Merge defaultFormData keys with item data to ensure all form fields have a value
    const mergedData = { ...defaultFormData };
    Object.keys(defaultFormData).forEach(key => {
        if ((item as any)[key] !== undefined) {
            mergedData[key] = (item as any)[key];
        }
    });
    setFormData(mergedData);
    setShowModal(true);
  };

  return (
    <>
        {loading ? (
          <AdminPageSkeleton />
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold font-display tracking-tight">{title}</h1>
              <div className="flex items-center gap-4">
                  <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-neu-accent text-white rounded-xl hover:bg-neu-accent/90 transition-colors font-bold text-sm shadow-neu-sm">
                    <Plus size={16} /> Add {itemName}
                  </button>
              </div>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="glass-card-inset text-xs font-mono uppercase text-neu-text-muted">
                    <tr>
                      {columns.map((col, idx) => (
                        <th key={idx} className="px-6 py-4 font-bold">{col.header}</th>
                      ))}
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-neu-text-muted font-mono">
                          No {itemName.toLowerCase()} items found.
                        </td>
                      </tr>
                    ) : paginatedItems.map((item: T, idx: number) => (
                      <tr key={item.id || idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        {columns.map((col, cIdx) => (
                          <td key={cIdx} className="px-6 py-4">
                            {col.render(item)}
                          </td>
                        ))}
                        <td className="px-6 py-4 flex justify-end gap-2">
                          {customActions && customActions(item)}
                          <button onClick={() => openEditModal(item)} className="p-2 rounded-xl glass-card text-neu-accent hover:scale-105 active:scale-95 transition-all" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl glass-card text-red-500 hover:scale-105 active:scale-95 transition-all" title="Delete">
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neu-bg rounded-3xl shadow-neu-modal w-full max-w-lg p-8 relative border border-white/5 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neu-text transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold font-display mb-6">{editingItem ? 'Edit' : 'Add'} {itemName}</h3>
            
            <form onSubmit={handleSave} className="space-y-4">
                {renderForm(formData, setFormData, !!editingItem)}
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl font-bold text-white bg-neu-accent shadow-neu hover:shadow-neu-sm active:scale-95 transition-all text-sm mt-4 disabled:opacity-50"
                >
                    {(() => {
                      if (isProcessing) return 'Processing...';
                      if (editingItem) return 'Save Changes';
                      return `Create ${itemName}`;
                    })()}
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
    </>
  );
}
