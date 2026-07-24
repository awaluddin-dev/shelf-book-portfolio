'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/shared/ui/admin/AdminSidebar';
import { useRouter } from 'next/navigation';
import { X, MessageSquare, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { cn } from '@/shared/lib/utils';
import { Testimonial } from '@/entities/testimonial/model/data';

export default function AdminTestimoni() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsProcessing] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const paginatedItems = testimonials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const router = useRouter();
  const { resolvedTheme: _resolvedTheme } = useTheme();
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/admin/login');
      return;
    }

    Promise.all([
      fetch('/api/status').then(res => res.json()),
      fetch('/api/testimonials?all=true').then(res => res.json())
    ]).then(([statusData, testData]) => {
      setStatus((statusData.data?.status || statusData.status));
      setTestimonials(testData.data?.testimonials || testData.testimonials || (Array.isArray(testData.data) ? testData.data : (Array.isArray(testData) ? testData : [])));
      setLoading(false);
    });
  }, [router]);

  const handleTestimonialAction = async (e: React.MouseEvent, id: string, newStatus: 'accepted' | 'rejected') => {
    e.stopPropagation();
    
    // Optimistic update
    const previousTestimonials = [...testimonials];
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error('Failed to update testimonial');
      
      setToastMessage({ message: `Testimonial successfully ${newStatus}`, type: 'success' });
    } catch {
      setTestimonials(previousTestimonials);
      setToastMessage({ message: 'Failed to update testimonial', type: 'error' });
      setIsProcessing(false);
}

    setTimeout(() => setToastMessage(null), 3000);
    
    if (selectedTestimonial?.id === id) {
      setSelectedTestimonial(null);
    }
  };

  return (
    <div className="min-h-screen bg-neu-bg flex text-neu-text">
      {/* Sidebar */}
      <AdminSidebar activePath="/admin/testimoni" />

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
            <h1 className="text-2xl font-bold font-display tracking-tight">Testimonials Management</h1>
            </div>

          {/* Testimonials Table */}
          <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold">Testimonials Review</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="glass-card-inset text-xs font-mono uppercase text-neu-text-muted">
                  <tr>
                    <th className="px-6 py-4 font-bold">Name / Company</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {(testimonials.length === 0) ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-neu-text-muted font-mono">No testimonials found.</td>
                    </tr>
                  ) : paginatedItems.map((t: any) => (
                    <tr 
                      key={t.id || t.name} 
                      className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedTestimonial(t)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold">{t.name}</div>
                        <div className="text-xs text-neu-text-muted">{t.role} @ {t.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold",
                          t.status === 'pending' ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                          t.status === 'accepted' || !t.status ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                          "bg-red-500/20 text-red-600 dark:text-red-400"
                        )}>
                          {t.status || 'accepted'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        {t.status === 'pending' && (
                          <>
                            <button 
                              onClick={(e) => handleTestimonialAction(e, t.id, 'accepted')}
                              className="p-2 rounded-xl glass-card text-emerald-500 hover:scale-105 active:scale-95 transition-all"
                              title="Accept"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={(e) => handleTestimonialAction(e, t.id, 'rejected')}
                              className="p-2 rounded-xl glass-card text-red-500 hover:scale-105 active:scale-95 transition-all"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {t.status !== 'pending' && t.id && (
                          <div className="text-xs text-neu-text-muted flex items-center h-full pt-2">
                             Processed
                          </div>
                        )}
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, testimonials.length)} of {testimonials.length} entries
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

      {/* Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neu-bg rounded-3xl shadow-neu-modal w-full max-w-lg p-8 relative border border-white/5">
            <button 
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neu-text transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full glass-card-inset flex items-center justify-center text-neu-accent">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">{selectedTestimonial.name}</h3>
                <p className="text-xs text-neu-text-muted">{selectedTestimonial.role} @ {selectedTestimonial.company}</p>
                {selectedTestimonial.url && (
                  <a href={selectedTestimonial.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-neu-accent hover:underline break-all">
                    {selectedTestimonial.url}
                  </a>
                )}
              </div>
            </div>
            <div className="p-5 glass-card-inset rounded-2xl mb-6 text-sm leading-relaxed text-neu-text-muted italic">
              &quot;{selectedTestimonial.testimonial}&quot;
            </div>
            
            {selectedTestimonial.status === 'pending' && selectedTestimonial.id && (
              <div className="flex gap-4">
                <button 
                  onClick={(e) => handleTestimonialAction(e, selectedTestimonial.id, 'rejected')}
                  className="flex-1 py-3 rounded-xl font-bold text-red-500 glass-card hover:shadow-neu-sm active:scale-95 transition-all text-sm"
                >
                  Reject
                </button>
                <button 
                  onClick={(e) => handleTestimonialAction(e, selectedTestimonial.id, 'accepted')}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-500 shadow-neu hover:shadow-neu-sm active:scale-95 transition-all text-sm"
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className={cn(
              "fixed bottom-8 left-1/2 z-[200] px-6 py-3.5 rounded-2xl font-mono text-xs shadow-neu border backdrop-blur-md flex items-center gap-2.5",
              toastMessage.type === 'success' 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                : "bg-red-500/10 text-red-500 border-red-500/20"
            )}
          >
            {toastMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            <span>{toastMessage.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
