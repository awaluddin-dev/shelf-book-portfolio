'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { AdminTable } from '@/shared/ui/admin/AdminTable';
import { Edit, Trash2, Eye, X } from 'lucide-react';

export default function AdminWork() {
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingWork, setEditingWork] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    years: '', duration: '', company: '', role: '', stack: '', teaser: '', fullImpact: '', bullets: ''
  });
  const [viewingWork, setViewingWork] = useState<any | null>(null);

  const fetchWork = async () => {
    try {
      const res = await fetch('/api/work');
      const data = await res.json();
      setWorkExperiences(data.data?.workExperience || data.workExperience || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])));
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/admin/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWork();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    setIsProcessing(true);
    e.preventDefault();
    try {
      const url = editingWork ? `/api/work/${editingWork.id}` : '/api/work';
      const method = editingWork ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          ...formData,
          bullets: formData.bullets.split('\\n').map(b => b.trim()).filter(Boolean)
        })
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      setToastMessage({ message: `Successfully ${editingWork ? 'updated' : 'added'} experience`, type: 'success' });
      setShowModal(false);
      setEditingWork(null);
      fetchWork();
    } catch {
      setToastMessage({ message: 'Failed to save experience', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      const res = await fetch(`/api/work/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (!res.ok) throw new Error('Failed to delete');
      
      setToastMessage({ message: 'Successfully deleted experience', type: 'success' });
      fetchWork();
    } catch {
      setToastMessage({ message: 'Failed to delete experience', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setFormData({ years: '', duration: '', company: '', role: '', stack: '', teaser: '', fullImpact: '', bullets: '' });
    setShowModal(true);
  };

  const openEditModal = (work: any) => {
    setEditingWork(work);
    setFormData({
      years: work.years || '',
      duration: work.duration || '',
      company: work.company || '',
      role: work.role || '',
      stack: work.stack || '',
      teaser: work.teaser || '',
      fullImpact: work.fullImpact || '',
      bullets: Array.isArray(work.bullets) ? work.bullets.join('\\n') : (work.bullets || '')
    });
    setShowModal(true);
  };

  const formContent = (
    <form onSubmit={handleSave} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Role</label>
                <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. Software Engineer" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Company</label>
                <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. Google" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Years</label>
                <input required value={formData.years} onChange={e => setFormData({...formData, years: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. 2022 - Present" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted">Duration</label>
                <input required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. 2 yrs 5 mos" />
            </div>
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Tech Stack</label>
            <input required value={formData.stack} onChange={e => setFormData({...formData, stack: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. React, Node.js, AWS" />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Teaser</label>
            <textarea required value={formData.teaser} onChange={e => setFormData({...formData, teaser: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="Short description..." />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Full Impact</label>
            <textarea required value={formData.fullImpact} onChange={e => setFormData({...formData, fullImpact: e.target.value})} rows={4} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="Detailed impact and responsibilities..." />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted">Bullets (One per line)</label>
            <textarea required value={formData.bullets} onChange={e => setFormData({...formData, bullets: e.target.value})} rows={4} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="Led a team of 5...\nIncreased performance by 20%..." />
        </div>
        
        <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-neu-accent shadow-neu hover:shadow-neu-sm active:scale-95 transition-all text-sm mt-4">
            {editingWork ? 'Save Changes' : 'Create Experience'}
        </button>
    </form>
  );

  return (
    <AdminPageLayout
      activePath="/admin/work"
      title="Work Experience Management"
      loading={loading}
      onAdd={openAddModal}
      addButtonLabel="Add New"
      toastMessage={toastMessage}
      showModal={showModal}
      onCloseModal={() => setShowModal(false)}
      modalTitle={editingWork ? 'Edit Experience' : 'Add New Experience'}
      modalContent={formContent}
    >
      <AdminTable
        headers={['Role & Company', 'Years & Duration', 'Actions']}
        items={workExperiences}
        currentPage={currentPage}
        itemsPerPage={5}
        onPageChange={setCurrentPage}
        emptyMessage="No work experience found."
        renderRow={(w: any) => (
          <>
            <td className="px-6 py-4">
              <div className="font-bold text-neu-text">{w.role}</div>
              <div className="text-xs text-neu-text-muted">{w.company}</div>
            </td>
            <td className="px-6 py-4">
              <div className="font-bold text-neu-text text-xs">{w.years}</div>
              <div className="text-xs text-neu-text-muted">{w.duration}</div>
            </td>
            <td className="px-6 py-4 flex justify-end gap-2">
              <button onClick={() => setViewingWork(w)} className="p-2 rounded-xl glass-card text-neu-text hover:scale-105 active:scale-95 transition-all" title="View Detail">
                <Eye size={16} />
              </button>
              <button onClick={() => openEditModal(w)} className="p-2 rounded-xl glass-card text-neu-accent hover:scale-105 active:scale-95 transition-all" title="Edit">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(w.id)} className="p-2 rounded-xl glass-card text-red-500 hover:scale-105 active:scale-95 transition-all" title="Delete">
                <Trash2 size={16} />
              </button>
            </td>
          </>
        )}
      />

      {/* View Detail Modal */}
      {viewingWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-neu-bg rounded-3xl shadow-neu-modal w-full max-w-2xl p-8 relative border border-white/5 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setViewingWork(null)} className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neu-text transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold font-display mb-6">Work Experience Detail</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-1">Role & Company</h4>
                <p className="text-lg font-bold text-neu-text">{viewingWork.role} at {viewingWork.company}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-mono text-neu-text-muted mb-1">Years</h4>
                  <p className="text-base font-medium text-neu-text">{viewingWork.years}</p>
                </div>
                <div>
                  <h4 className="text-sm font-mono text-neu-text-muted mb-1">Duration</h4>
                  <p className="text-base font-medium text-neu-text">{viewingWork.duration}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-1">Tech Stack</h4>
                <p className="text-base font-medium text-neu-text">{viewingWork.stack}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-2">Teaser</h4>
                <div className="p-4 rounded-xl glass-card-inset text-sm font-medium border border-white/5 whitespace-pre-wrap text-neu-text">
                  {viewingWork.teaser}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-2">Full Impact</h4>
                <div className="p-4 rounded-xl glass-card-inset text-sm font-medium border border-white/5 whitespace-pre-wrap text-neu-text">
                  {viewingWork.fullImpact}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-mono text-neu-text-muted mb-2">Key Achievements</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {(Array.isArray(viewingWork.bullets) ? viewingWork.bullets : []).map((b: string, i: number) => (
                    <li key={i} className="text-sm text-neu-text">{b}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setViewingWork(null)} className="px-6 py-2.5 rounded-xl font-bold text-neu-text-muted hover:text-neu-text bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm">
                Close
              </button>
              <button onClick={() => {
                setViewingWork(null);
                openEditModal(viewingWork);
              }} className="px-6 py-2.5 rounded-xl font-bold text-white bg-neu-accent shadow-neu hover:shadow-neu-sm active:scale-95 transition-all text-sm flex items-center gap-2">
                <Edit size={16} /> Edit Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
