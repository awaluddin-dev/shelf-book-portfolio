'use client';

import { useState } from 'react';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { AdminTable } from '@/shared/ui/admin/AdminTable';
import { useAdminCrud } from '@/shared/hooks/useAdminCrud';
import { Edit, Trash2, Eye, X } from 'lucide-react';

export default function AdminWork() {
  const {
    items: workExperiences, loading, toastMessage, showModal, setShowModal, editingItem: editingWork,
    handleSave, handleDelete, openAddModal, openEditModal
  } = useAdminCrud({
    apiUrl: '/api/work',
    dataKey: 'workExperience',
    formatPayload: (formData) => ({
      ...formData,
      bullets: formData.bullets.split('\\n').map((b: string) => b.trim()).filter(Boolean)
    })
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    years: '', duration: '', company: '', role: '', stack: '', teaser: '', fullImpact: '', bullets: ''
  });
  const [viewingWork, setViewingWork] = useState<any | null>(null);

  const onAdd = () => openAddModal({ years: '', duration: '', company: '', role: '', stack: '', teaser: '', fullImpact: '', bullets: '' }, setFormData);
  const onEdit = (work: any) => openEditModal(work, (data) => setFormData({
    years: data.years || '',
    duration: data.duration || '',
    company: data.company || '',
    role: data.role || '',
    stack: data.stack || '',
    teaser: data.teaser || '',
    fullImpact: data.fullImpact || '',
    bullets: Array.isArray(data.bullets) ? data.bullets.join('\\n') : (data.bullets || '')
  }));

  const formContent = (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-adminwork-1">Role</label>
                <input id="field-adminwork-1" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. Software Engineer" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-adminwork-2">Company</label>
                <input id="field-adminwork-2" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. Google" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-adminwork-3">Years</label>
                <input id="field-adminwork-3" required value={formData.years} onChange={e => setFormData({...formData, years: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. 2022 - Present" />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-adminwork-4">Duration</label>
                <input id="field-adminwork-4" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. 2 yrs 5 mos" />
            </div>
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-adminwork-5">Tech Stack</label>
            <input id="field-adminwork-5" required value={formData.stack} onChange={e => setFormData({...formData, stack: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none" placeholder="e.g. React, Node.js, AWS" />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-adminwork-6">Teaser</label>
            <textarea id="field-adminwork-6" required value={formData.teaser} onChange={e => setFormData({...formData, teaser: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="Short description..." />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-adminwork-7">Full Impact</label>
            <textarea id="field-adminwork-7" required value={formData.fullImpact} onChange={e => setFormData({...formData, fullImpact: e.target.value})} rows={4} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="Detailed impact and responsibilities..." />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-mono text-neu-text-muted" htmlFor="field-adminwork-8">Bullets (One per line)</label>
            <textarea id="field-adminwork-8" required value={formData.bullets} onChange={e => setFormData({...formData, bullets: e.target.value})} rows={4} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-medium border border-white/5 focus:border-neu-accent outline-none resize-none" placeholder="Led a team of 5...\nIncreased performance by 20%..." />
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
      onAdd={onAdd}
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
              <button type="button" onClick={() => setViewingWork(w)} className="p-2 rounded-xl glass-card text-neu-text hover:scale-105 active:scale-95 transition-all" title="View Detail">
                <Eye size={16} />
              </button>
              <button type="button" onClick={() => onEdit(w)} className="p-2 rounded-xl glass-card text-neu-accent hover:scale-105 active:scale-95 transition-all" title="Edit">
                <Edit size={16} />
              </button>
              <button type="button" onClick={() => handleDelete(w.id)} className="p-2 rounded-xl glass-card text-red-500 hover:scale-105 active:scale-95 transition-all" title="Delete">
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
            <button type="button" onClick={() => setViewingWork(null)} className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neu-text transition-colors">
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
              <button type="button" onClick={() => setViewingWork(null)} className="px-6 py-2.5 rounded-xl font-bold text-neu-text-muted hover:text-neu-text bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm">
                Close
              </button>
              <button type="button" onClick={() => {
                setViewingWork(null);
                onEdit(viewingWork);
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
