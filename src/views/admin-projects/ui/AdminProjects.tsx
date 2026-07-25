'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/shared/ui/admin/AdminSidebar';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setIsProcessing] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedItems = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const defaultForm = {
    title: '', subtitle: '', category: '', tags: '', spineColor: '#4f46e5', coverColor: '#312e81',
    spineText: '', date: '', demoUrl: '', github: '', markdown: '', reasonToBuild: '', problemSolved: '',
    architectureImage: '',
    stats: [] as {label: string, value: string}[],
    phases: [] as {date: string, title: string, description: string}[]
  };
  const [formData, setFormData] = useState(defaultForm);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.data?.projects || data.projects || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/admin/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await fetch(`/api/projects/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (proj: any = null) => {
    if (proj) {
      setEditingId(proj.id);
      setFormData({
        title: proj.title || '',
        subtitle: proj.subtitle || '',
        category: proj.category || '',
        tags: (proj.data?.tags || proj.tags || (Array.isArray(proj.data) ? proj.data : (Array.isArray(proj) ? proj : []))).join(', '),
        spineColor: proj.spineColor || '#4f46e5',
        coverColor: proj.coverColor || '#312e81',
        spineText: proj.spineText || '',
        date: proj.date || '',
        demoUrl: proj.demoUrl || '',
        github: proj.github || '',
        markdown: proj.markdown || '',
        reasonToBuild: proj.reasonToBuild || '',
        problemSolved: proj.problemSolved || '',
        architectureImage: proj.architectureImage || '',
        stats: proj.data?.stats || proj.stats || (Array.isArray(proj.data) ? proj.data : (Array.isArray(proj) ? proj : [])),
        phases: proj.data?.phases || proj.phases || (Array.isArray(proj.data) ? proj.data : (Array.isArray(proj) ? proj : []))
      });
    } else {
      setEditingId(null);
      setFormData(defaultForm);
    }
    setIsModalOpen(true);
  };

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

  return (
    <div className="min-h-screen bg-neu-bg flex text-neu-text">
      <AdminSidebar activePath="/admin/projects" />

      <main className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <div className="max-w-6xl mx-auto space-y-6 p-6 w-full animate-pulse">
            <div className="h-10 bg-white/5 rounded-xl w-1/4"></div>
            <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
            <div className="h-64 bg-white/5 rounded-3xl w-full"></div>
            <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                <BookOpen className="text-neu-accent" /> Portfolio Projects
              </h1>
              <p className="text-xs text-neu-text-muted font-mono mt-1">Manage interactive bookshelf projects</p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-neu-accent text-white rounded-xl hover:bg-neu-accent/90 transition-colors font-bold text-sm shadow-neu-sm"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>

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
                        <div className="text-xs text-neu-text-muted truncate max-w-[250px]">{proj.subtitle}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-md glass-card-inset text-xs font-mono text-neu-accent">{proj.category}</span>
                      </td>
                      <td className="p-4 text-sm">{proj.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal(proj)} className="p-2 rounded-lg hover:bg-neu-accent/10 text-neu-accent transition-colors">
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
        </div>
      )}
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-neu-bg rounded-3xl p-6 shadow-neu-modal border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-display">{editingId ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full glass-card-inset hover:text-neu-accent">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    <p className="text-[10px] text-neu-text-muted font-mono pl-1">Export your Excalidraw diagram as SVG/PNG, place it in /public/assets/, then paste the path here.</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neu-text-muted">Demo URL (Optional)</label>
                    <input value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm outline-none focus:border-neu-accent border border-transparent" />
                  </div>
                </div>

                {/* Dynamic Stats */}
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
                        <button type="button" onClick={() => removeStat(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Phases */}
                <div className="p-4 border border-white/5 rounded-2xl space-y-4 bg-black/5 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">Project Phases</h3>
                    <button type="button" onClick={addPhase} className="text-xs font-bold text-neu-accent">Add Phase</button>
                  </div>
                  <div className="space-y-3">
                    {formData.phases.map((phase, i) => (
                      <div key={i} className="flex flex-col gap-2 p-3 border border-white/10 rounded-xl relative">
                        <button type="button" onClick={() => removePhase(i)} className="absolute top-2 right-2 text-red-500"><Trash2 size={14}/></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input placeholder="Date" value={phase.date} onChange={e => updatePhase(i, 'date', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
                          <input placeholder="Title" value={phase.title} onChange={e => updatePhase(i, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent" />
                        </div>
                        <textarea placeholder="Description" value={phase.description} onChange={e => updatePhase(i, 'description', e.target.value)} className="w-full px-3 py-2 rounded-lg glass-card-inset text-xs outline-none focus:border-neu-accent border border-transparent min-h-[60px]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neu-text-muted">Markdown Content</label>
                  <textarea required value={formData.markdown} onChange={e => setFormData({...formData, markdown: e.target.value})} className="w-full px-4 py-2.5 rounded-xl glass-card-inset text-sm font-mono outline-none focus:border-neu-accent border border-transparent min-h-[200px]" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-neu-text-muted hover:text-neu-text transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-neu-accent text-white font-bold text-sm rounded-xl shadow-neu-sm hover:bg-neu-accent/90 transition-colors">
                    {editingId ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
