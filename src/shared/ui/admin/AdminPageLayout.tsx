import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/shared/lib/utils';

interface AdminPageLayoutProps {
  activePath: string;
  title: string;
  loading: boolean;
  onAdd?: () => void;
  addButtonLabel?: string;
  toastMessage: { message: string, type: 'success' | 'error' } | null;
  children: ReactNode;
  showModal?: boolean;
  onCloseModal?: () => void;
  modalTitle?: string;
  modalContent?: ReactNode;
  modalMaxWidth?: 'max-w-lg' | 'max-w-2xl' | 'max-w-4xl';
}

export function AdminPageLayout({
  activePath,
  title,
  loading,
  onAdd,
  addButtonLabel,
  toastMessage,
  children,
  showModal,
  onCloseModal,
  modalTitle,
  modalContent,
  modalMaxWidth = 'max-w-lg'
}: AdminPageLayoutProps) {
  return (
    <div className="min-h-screen bg-neu-bg flex text-neu-text">
      {/* Sidebar */}
      <AdminSidebar activePath={activePath} />

      {/* Main Content */}
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
              <h1 className="text-2xl font-bold font-display tracking-tight">{title}</h1>
              {onAdd && (
                <div className="flex items-center gap-4">
                  <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-neu-accent text-white rounded-xl hover:bg-neu-accent/90 transition-colors font-bold text-sm shadow-neu-sm">
                    <Plus size={16} /> {addButtonLabel}
                  </button>
                </div>
              )}
            </div>

            {children}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`bg-neu-bg rounded-3xl shadow-neu-modal w-full ${modalMaxWidth} p-8 relative border border-white/5 max-h-[90vh] overflow-y-auto`}>
            {onCloseModal && (
              <button onClick={onCloseModal} className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neu-text transition-colors">
                <X size={20} />
              </button>
            )}
            {modalTitle && <h3 className="text-xl font-bold font-display mb-6">{modalTitle}</h3>}
            {modalContent}
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
