import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, LogOut, LayoutDashboard, MessageSquare, ChevronRight, ChevronLeft, Network, Rocket, Layers, Cpu, ArrowLeft, BookOpen, Palette, Milestone } from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/shared/lib/utils';

export function AdminSidebar({ activePath }: { activePath: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/projects', icon: BookOpen, label: 'Projects' },
    { path: '/admin/architecture', icon: Layers, label: 'Architecture' },
    { path: '/admin/lifecycle', icon: Milestone, label: 'Lifecycle' },
    { path: '/admin/testimoni', icon: MessageSquare, label: 'Testimonials' },
    { path: '/admin/work', icon: Briefcase, label: 'Work Exp.' },
    { path: '/admin/skill', icon: Network, label: 'Skill Tree' },
    { path: '/admin/learning', icon: Rocket, label: 'Learning' },
    { path: '/admin/current', icon: Layers, label: 'Right Now' },
    { path: '/admin/proficiency', icon: Cpu, label: 'Proficiency' },
    { path: '/admin/playground', icon: Palette, label: 'Theme Playground' },
  ];

  return (
    <div className="p-6 h-screen py-[10vh] flex flex-col justify-start sticky top-0">
      <motion.aside 
        animate={{ width: isExpanded ? 240 : 64 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative h-full flex flex-col p-1.5 rounded-2xl overflow-hidden z-10"
      >
        <div className="flex-1 flex flex-col p-1 overflow-hidden">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-10 rounded-xl flex items-center gap-3 px-2 text-neu-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors overflow-hidden whitespace-nowrap"
          >
            <div className="min-w-[24px] flex justify-center">
              {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </div>
            <AnimatePresence>
              {isExpanded && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="font-bold font-display text-sm">Collapse</motion.span>}
            </AnimatePresence>
          </button>
          
          <div className="w-full h-px bg-black/10 dark:bg-white/10 my-2 shrink-0" />

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pb-2 hide-scrollbar">
          {navItems.map(item => {
            const isActive = activePath === item.path;
            const Icon = item.icon;
            return (
              <button 
                key={item.path}
                onClick={() => router.push(item.path)} 
                className={cn(
                  "h-10 rounded-xl flex items-center gap-3 px-2 transition-colors overflow-hidden whitespace-nowrap",
                  isActive ? "bg-black/5 dark:bg-white/5 text-neu-accent font-bold" : "text-neu-text hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <div className="min-w-[24px] flex justify-center"><Icon size={18} /></div>
                <AnimatePresence>
                  {isExpanded && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-sm">{item.label}</motion.span>}
                </AnimatePresence>
              </button>
            )
          })}
          </div>

          <div className="mt-auto pt-2 space-y-2 border-t border-black/10 dark:border-white/10 shrink-0">
            {activePath === '/admin/dashboard' && (
              <button onClick={() => router.push('/')} className="w-full h-10 rounded-xl flex items-center gap-3 px-2 hover:bg-black/5 dark:hover:bg-white/5 text-neu-text transition-colors overflow-hidden whitespace-nowrap">
                <div className="min-w-[24px] flex justify-center"><ArrowLeft size={18} /></div>
                <AnimatePresence>{isExpanded && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="font-bold text-sm">Back to Portfolio</motion.span>}</AnimatePresence>
              </button>
            )}
            <button onClick={handleLogout} className="w-full h-10 rounded-xl flex items-center gap-3 px-2 hover:bg-red-500/10 text-neu-text-muted hover:text-red-500 transition-colors overflow-hidden whitespace-nowrap">
              <div className="min-w-[24px] flex justify-center"><LogOut size={18} /></div>
              <AnimatePresence>{isExpanded && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="font-bold text-sm">Logout</motion.span>}</AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
