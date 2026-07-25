'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, ChevronLeft, ChevronRight, BookOpen, Trash } from 'lucide-react';
import { AdminPageLayout } from '@/shared/ui/admin/AdminPageLayout';
import { useAdminCrud } from '@/shared/hooks/useAdminCrud';

export default function AdminProjects() {
  const {
    items: projects, loading, toastMessage, showModal, setShowModal, editingItem,
    handleSave, handleDelete, openAddModal, openEditModal
  } = useAdminCrud({
    apiUrl: '/api/projects',
    dataKey: 'projects',
    formatPayload: (formData) => ({
      ...formData,
      tags: formData.tags.split(',').map((s: string) => s.trim()).filter(Boolean)
    })
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedItems = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const router = useRouter();

  const defaultForm = {
    title: '', subtitle: '', category: '', tags: '', spineColor: '#4f46e5', coverColor: '#312e81',
    spineText: '', date: '', demoUrl: '', github: '', markdown: '', reasonToBuild: '', problemSolved: '',
    architectureImage: '',
    stats: [] as {label: string, value: string}[],
    phases: [] as {date: string, title: string, description: string}[]
  };
  const [formData, setFormData] = useState(defaultForm);

  const onAdd = () => openAddModal(defaultForm, setFormData);
  const onEdit = (proj: any) => openEditModal(proj, (data) => setFormData({
    title: data.title || '',
    subtitle: data.subtitle || '',
    category: data.category || '',
    tags: (data.data?.tags || data.tags || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))).join(', '),
    spineColor: data.spineColor || '#4f46e5',
    coverColor: data.coverColor || '#312e81',
    spineText: data.spineText || '',
    date: data.date || '',
    demoUrl: data.demoUrl || '',
    github: data.github || '',
    markdown: data.markdown || '',
    reasonToBuild: data.reasonToBuild || '',
    problemSolved: data.problemSolved || '',
    architectureImage: data.architectureImage || '',
    stats: data.data?.stats || data.stats || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])),
    phases: data.data?.phases || data.phases || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))
  }));

  const addStat = () => setFormData({...formData, stats: [...formData.stats, {label: '', value: ''}]});
  const updateStat = (index: number, field: string, val: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: val };
    setFormData({...formData, stats: newStats});
  };
  const removeStat = (index: number) => {
    const newStats = [...formData.stats];
    newStats.splice(index, 1);
    setFormData({...formData, stats: newStats});
  };

  const addPhase = () => setFormData({...formData, phases: [...formData.phases, {date: '', title: '', description: ''}]});
  const updatePhase = (index: number, field: string, val: string) => {
    const newPhases = [...formData.phases];
    newPhases[index] = { ...newPhases[index], [field]: val };
    setFormData({...formData, phases: newPhases});
  };
  const removePhase = (index: number) => {
    const newPhases = [...formData.phases];
    newPhases.splice(index, 1);
    setFormData({...formData, phases: newPhases});
  };

  const formContent = (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-mono text-neu-text-muted">Title</label>
          <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-mono text-neu-text-muted">Subtitle</label>
          <input required value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-mono text-neu-text-muted">Category</label>
          <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-mono text-neu-text-muted">Date</label>
          <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-mono text-neu-text-muted">Tags (comma separated)</label>
        <input required value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-mono text-neu-text-muted uppercase">Spine Color</label>
          <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl glass-card-inset">
            <input type="color" required value={formData.spineColor} onChange={e => setFormData({...formData, spineColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0" />
            <span className="text-sm font-mono text-neu-text">{formData.spineColor}</span>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-mono text-neu-text-muted uppercase">Cover Color</label>
          <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl glass-card-inset">
            <input type="color" required value={formData.coverColor} onChange={e => setFormData({...formData, coverColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0" />
            <span className="text-sm font-mono text-neu-text">{formData.coverColor}</span>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-mono text-neu-text-muted">Spine Text</label>
          <input required value={formData.spineText} onChange={e => setFormData({...formData, spineText: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-mono text-neu-text-muted">GitHub URL</label>
          <input value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
        </div>
        <div className="col-span-full space-y-1">
          <label className="text-xs font-mono text-neu-accent font-bold flex items-center gap-1.5">⚡ Architecture Diagram (Excalidraw Export)</label>
          <input value={formData.architectureImage} onChange={e => setFormData({...formData, architectureImage: e.target.value})} placeholder="/assets/architecture.svg or /assets/diagram.png" className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-neu-accent/20" />
          <p className="text-xs text-neu-text-muted font-mono pl-1">Export your Excalidraw diagram as SVG/PNG, place it in /public/assets/, then paste the path here.</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-mono text-neu-text-muted">Demo URL (Optional)</label>
          <input value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
        </div>
      </div>

      <div className="p-4 border border-white/5 rounded-2xl space-y-4 bg-black/5 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm">Highlight Stats</h3>
          <button type="button" onClick={addStat} className="text-xs font-bold text-neu-accent">Add Stat</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {formData.stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <input placeholder="Label" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
              <input placeholder="Value" value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
              <button type="button" onClick={() => removeStat(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash size={14}/></button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border border-white/5 rounded-2xl space-y-4 bg-black/5 dark:bg-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm">Project Phases</h3>
          <button type="button" onClick={addPhase} className="text-xs font-bold text-neu-accent">Add Phase</button>
        </div>
        <div className="space-y-3">
          {formData.phases.map((phase, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 border border-white/10 rounded-xl relative">
              <button type="button" onClick={() => removePhase(i)} className="absolute top-2 right-2 text-red-500"><Trash size={14}/></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input placeholder="Date" value={phase.date} onChange={e => updatePhase(i, 'date', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
                <input placeholder="Title" value={phase.title} onChange={e => updatePhase(i, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
              </div>
              <textarea placeholder="Description" value={phase.description} onChange={e => updatePhase(i, 'description', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent min-h-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-mono text-neu-text-muted">Markdown Content</label>
        <textarea required value={formData.markdown} onChange={e => setFormData({...formData, markdown: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-mono outline-none focus:border-neu-accent border border-transparent min-h-52" />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-neu-text-muted hover:text-neu-text transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2 bg-neu-accent text-white font-bold text-sm rounded-xl shadow-neu-sm hover:bg-neu-accent/90 transition-colors">
          {editingItem ? 'Save Changes' : 'Create Project'}
        </button>
      </div>
    </form>
  );

  return (
    <AdminPageLayout
      activePath="/admin/projects"
      title="Portfolio Projects"
      loading={loading}
      onAdd={onAdd}
      addButtonLabel="Add Project"
      toastMessage={toastMessage}
      showModal={showModal}
      onCloseModal={() => setShowModal(false)}
      modalTitle={editingItem ? 'Edit Project' : 'New Project'}
      modalContent={formContent}
      modalMaxWidth="max-w-4xl"
    >
      <div className="glass-card rounded-3xl p-6 border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono text-neu-text-muted uppercase tracking-wider">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((proj: any) => (
                <tr key={proj.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold">{proj.title}</div>
                    <div className="text-xs text-neu-text-muted truncate max-w-64">{proj.subtitle}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-md glass-card-inset text-xs font-mono text-neu-accent">{proj.category}</span>
                  </td>
                  <td className="p-4 text-sm">{proj.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(proj)} className="p-2 rounded-lg hover:bg-neu-accent/10 text-neu-accent transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(proj.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neu-text-muted font-mono text-sm">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-neu-text-muted font-mono">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, projects.length)} of {projects.length} entries
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
    </AdminPageLayout>
  );
}
